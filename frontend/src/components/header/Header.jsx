import React, { useState, useEffect } from "react";
import "./header.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import API from "../../services/api";

function Header() {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [loginModal, setLoginModal] = useState(false);
  const [auth, setAuth] = useState("login");
  const [username, setUsername] = useState("Sign in");

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
    const storedUser = localStorage.getItem("mobilix_user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.name) {
          setUsername(parsedUser.name);
        }
      } catch (err) {
        console.error("Failed to parse stored user", err);
      }
    }
  }, []);

  const handleDropdown = () => {
    setOpenDropdown(!openDropdown);
  };

  const handleLoginToggle = () => {
    setLoginModal(!loginModal);
    setError("");
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

      const { token, user } = response.data;
      localStorage.setItem("mobilix_token", token);
      localStorage.setItem("mobilix_user", JSON.stringify(user));

      setUsername(user.name);

      setLoading(false);
      setLoginModal(false);
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

      const { token, user } = response.data;
      localStorage.setItem("mobilix_token", token);
      localStorage.setItem("mobilix_user", JSON.stringify(user));

      setUsername(user.name);
      setLoading(false);
      setLoginModal(false);
      navigate("/");
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <>
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
          <Link
            className="sign-in"
            to="#"
            onClick={(e) => {
              e.preventDefault();
              handleLoginToggle();
            }}
          >
            <span></span>
            <p>{username}</p>
          </Link>
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
                    handleLoginToggle();
                  }}
                >
                  <span></span>
                  <p>{username}</p>
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
              </div>
            </div>
          </div>
        </div>
      )}

      {loginModal && (
        <div className="login-modal">
          <div className="login-container">
            <div className="modal-top">
              <p></p>
              <button onClick={handleLoginToggle}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            {auth === "login" ? (
              <div className="login">
                <h1>Login</h1>
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
