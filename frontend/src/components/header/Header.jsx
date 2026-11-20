import React, { useState, useEffect } from "react";
import "./header.css";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import API, { API_BASE_URL } from "../../services/api";

function Header() {
  const location = useLocation();
  const [loadOverlay, setLoadOverlay] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [loginModal, setLoginModal] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [auth, setAuth] = useState("login");
  const [user, setUser] = useState(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regName, setRegName] = useState("");
  const [regPass, setRegPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userParam = params.get("user");
    const errorParam = params.get("error");

    if (errorParam) {
      setError(
        errorParam === "google_auth_failed"
          ? "Google sign-in was canceled or failed. Please try again."
          : `Sign-in error: ${errorParam}`,
      );
      setLoginModal(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (token && userParam) {
      try {
        const parsedUser = JSON.parse(decodeURIComponent(userParam));
        localStorage.setItem("mobilix_token", token);
        localStorage.setItem("mobilix_user", JSON.stringify(parsedUser));
        setUser(parsedUser);
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );
      } catch (err) {
        console.error("Failed to parse Google login redirect user", err);
      }
    } else {
      const storedToken = localStorage.getItem("mobilix_token");
      const storedUser = localStorage.getItem("mobilix_user");
      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    }

    const sessionLoaded = sessionStorage.getItem("mobilix_home_loaded_once");
    if (location.pathname !== "/" || sessionLoaded === "true") {
      setLoadOverlay(false);
      return;
    }

    setLoadOverlay(true);
    const timer = setTimeout(() => {
      setLoadOverlay(false);
      sessionStorage.setItem("mobilix_home_loaded_once", "true");
    }, 5000);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  const handleDropdown = () => {
    setOpenDropdown(!openDropdown);
  };

  const handleUserClick = () => {
    if (user) {
      setUserDropdown((prev) => !prev);
    } else {
      setLoginModal(true);
      setError("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("mobilix_token");
    localStorage.removeItem("mobilix_user");
    setUser(null);
    setUserDropdown(false);
    navigate("/");
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await API.post("/auth/login", {
        email: loginEmail,
        password: loginPass,
      });

      const { token, user: loggedUser } = response.data;
      localStorage.setItem("mobilix_token", token);
      localStorage.setItem("mobilix_user", JSON.stringify(loggedUser));

      setUser(loggedUser);
      setLoading(false);
      setLoginModal(false);
      setLoginEmail("");
      setLoginPass("");
      navigate("/");
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Invalid credentials.");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await API.post("/auth/register", {
        name: regName,
        email: regEmail,
        password: regPass,
      });

      const { token, user: loggedUser } = response.data;
      localStorage.setItem("mobilix_token", token);
      localStorage.setItem("mobilix_user", JSON.stringify(loggedUser));

      setUser(loggedUser);
      setLoading(false);
      setLoginModal(false);
      setRegEmail("");
      setRegName("");
      setRegPass("");
      navigate("/");
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <>
      {loadOverlay && (
        <div className="load-overlay">
          <div className="loader-modal">
            <div id="load-image"></div>
            <div className="loading-bar" aria-label="Loading">
              <span className="loading-fill"></span>
            </div>
            <p>Book, Drive, Go</p>
          </div>
        </div>
      )}
      <header>
        <div className="head-one">
          <img src="Mobilix-transaparent.png" alt="mobilix-logo" />
          <Link to={"/"}>Mobilix</Link>
        </div>
        <nav>
          <div className="nav-links">
            <ul>
              <li>
                <NavLink to={"/"}>Home</NavLink>
              </li>
              <li>
                <NavLink to={"/about"}>About</NavLink>
              </li>
              <li>
                <NavLink to={"/services"}>Services</NavLink>
              </li>
              <li>
                <NavLink to={"/tickets"}>Tickets</NavLink>
              </li>
              <li>
                <NavLink to={"/contact"}>Contact</NavLink>
              </li>
            </ul>
          </div>
          <Link to={"/booking"}>
            <button>Booking</button>
          </Link>

          <div style={{ position: "relative" }}>
            <Link
              className="sign-in"
              to="#"
              onClick={(e) => {
                e.preventDefault();
                handleUserClick();
              }}
              title={user ? "Account menu" : "Click to sign in"}
            >
              <span></span>
              <p>{user ? user.name : "Sign in"}</p>
              {user && (
                <i
                  className="fa-solid fa-chevron-down"
                  style={{ fontSize: "12px", marginLeft: "4px" }}
                ></i>
              )}
            </Link>

            {user && userDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "120%",
                  right: 0,
                  backgroundColor: "#fff",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                  borderRadius: "8px",
                  padding: "10px",
                  minWidth: "160px",
                  zIndex: 2000,
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <div
                  style={{
                    padding: "6px 8px",
                    borderBottom: "1px solid #f0f0f0",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontWeight: "bold",
                      fontSize: "14px",
                      color: "#333",
                    }}
                  >
                    {user.name}
                  </p>
                  <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>
                    {user.email}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "none",
                    border: "none",
                    color: "#dc2626",
                    padding: "8px",
                    fontSize: "14px",
                    cursor: "pointer",
                    borderRadius: "6px",
                    textAlign: "left",
                    width: "100%",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#fee2e2")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "18px" }}
                  >
                    logout
                  </span>
                  Sign out
                </button>
              </div>
            )}
          </div>
        </nav>

        <button id="menu-icon" onClick={handleDropdown}>
          <span className="material-symbols-outlined">
            {openDropdown === false ? "menu" : "close"}
          </span>
        </button>
      </header>

      {openDropdown && (
        <div className="nav-overlay">
          <div className="nav-dropdown">
            <div className="dropdown-top">
              <div className="close">
                <Link
                  className="sign-in"
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenDropdown(false);
                    handleUserClick();
                  }}
                >
                  <span></span>
                  <p>{user ? user.name : "Sign in"}</p>
                </Link>
                <span
                  className="material-symbols-outlined"
                  id="close-icon"
                  onClick={() => setOpenDropdown(false)}
                >
                  close
                </span>
              </div>
              <div className="dropdown-links">
                <NavLink to={"/"} onClick={() => setOpenDropdown(false)}>
                  Home
                </NavLink>
                <NavLink to={"/about"} onClick={() => setOpenDropdown(false)}>
                  About
                </NavLink>
                <NavLink
                  to={"/services"}
                  onClick={() => setOpenDropdown(false)}
                >
                  Services
                </NavLink>
                <NavLink to={"/tickets"} onClick={() => setOpenDropdown(false)}>
                  Tickets
                </NavLink>
                <NavLink to={"/contact"} onClick={() => setOpenDropdown(false)}>
                  Contact
                </NavLink>
                <Link to={"/booking"} onClick={() => setOpenDropdown(false)}>
                  <button>Booking</button>
                </Link>
                {user && (
                  <button
                    id="user-signout-btn"
                    type="button"
                    onClick={() => {
                      setOpenDropdown(false);
                      handleLogout();
                    }}
                  >
                    <span className="material-symbols-outlined">logout</span>
                    Sign out
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {!user && loginModal && (
        <div className="login-modal">
          <div className="login-container">
            <div className="modal-top">
              <p></p>
              <button onClick={() => setLoginModal(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            {auth === "login" ? (
              <div className="login">
                <h1>Login</h1>

                <a
                  id="google-sign-in-btn"
                  href={`${API_BASE_URL}/auth/google?returnTo=${encodeURIComponent(window.location.origin + window.location.pathname)}`}
                  className="google-sign-in-btn"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  Continue with Google
                </a>

                <div className="auth-separator">
                  <span>or with email</span>
                </div>

                <form onSubmit={handleLoginSubmit}>
                  {error && <p id="auth-errors">{error}</p>}
                  <div className="form-div">
                    <label htmlFor="login-email">Email address</label>
                    <span>
                      <span className="material-symbols-outlined">mail</span>
                      <input
                        type="email"
                        name="login-email"
                        id="login-email"
                        placeholder="your@email.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                      />
                    </span>
                  </div>
                  <div className="form-div">
                    <label htmlFor="login-pass">Password</label>
                    <span>
                      <span className="material-symbols-outlined">lock</span>
                      <input
                        type={showPass ? "text" : "password"}
                        name="login-pass"
                        id="login-pass"
                        placeholder="********"
                        value={loginPass}
                        onChange={(e) => setLoginPass(e.target.value)}
                        required
                      />
                    </span>
                  </div>
                  <span>
                    <input
                      type="checkbox"
                      name="show-pass"
                      id="show-pass"
                      checked={showPass}
                      onChange={() => setShowPass(!showPass)}
                    />
                    <label htmlFor="show-pass">Show Password</label>
                  </span>
                  <button type="submit" disabled={loading}>
                    {loading ? "Signing in..." : "Sign in"}
                  </button>
                </form>
                <p>
                  Don't have an account?{" "}
                  <Link
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setError("");
                      setAuth("register");
                    }}
                  >
                    Register
                  </Link>
                </p>
              </div>
            ) : (
              <div className="register">
                <h1>Create an account</h1>

                <a
                  id="google-sign-in-btn"
                  href={`${API_BASE_URL}/auth/google?returnTo=${encodeURIComponent(window.location.origin + window.location.pathname)}`}
                  className="google-sign-in-btn"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  Sign up with Google
                </a>

                <div className="auth-separator">
                  <span>or with email</span>
                </div>

                <form onSubmit={handleRegisterSubmit}>
                  {error && <p id="auth-errors">{error}</p>}
                  <div className="form-div">
                    <label htmlFor="register-email">Email address</label>
                    <span>
                      <span className="material-symbols-outlined">mail</span>
                      <input
                        type="email"
                        name="register-email"
                        id="register-email"
                        placeholder="your@email.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        required
                      />
                    </span>
                  </div>
                  <div className="form-div">
                    <label htmlFor="username">Username</label>
                    <span>
                      <span className="material-symbols-outlined">person</span>
                      <input
                        type="text"
                        name="username"
                        id="username"
                        placeholder="Eg. Fidel"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        required
                      />
                    </span>
                  </div>
                  <div className="form-div">
                    <label htmlFor="register-pass">Password</label>
                    <span>
                      <span className="material-symbols-outlined">lock</span>
                      <input
                        type={showPass ? "text" : "password"}
                        name="register-pass"
                        id="register-pass"
                        placeholder="********"
                        value={regPass}
                        onChange={(e) => setRegPass(e.target.value)}
                        required
                      />
                    </span>
                  </div>
                  <span>
                    <input type="checkbox" name="agree" id="agree" required />
                    <label htmlFor="agree">
                      Agree to the{" "}
                      <Link to={"/register/terms-and-conditions"}>
                        terms and conditions
                      </Link>
                    </label>
                  </span>
                  <button type="submit" disabled={loading}>
                    {loading ? "Creating account..." : "Register"}
                  </button>
                </form>
                <p>
                  Already have an account?{" "}
                  <Link
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setError("");
                      setAuth("login");
                    }}
                  >
                    Login
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
