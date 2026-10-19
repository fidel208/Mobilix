import React, { useState } from "react";
import "./header.css";
import { Link, NavLink } from "react-router-dom";

function Header() {
  const [openDropdown, setOpenDropdown] = useState(false);
  const handleDropdown = () => {
    if (openDropdown === false) {
      setOpenDropdown(true);
    } else {
      setOpenDropdown(false);
    }
  };

  const [loginModal, setLoginModal] = useState(false);
  const handleLogin = () => {
    if (loginModal === false) {
      setLoginModal(true);
    } else {
      setLoginModal(false);
    }
  };

  const [auth, setAuth] = useState("login");

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
            onClick={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <span></span>
            <p>Sign in</p>
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
                  onClick={(e) => {
                    e.preventDefault();
                    handleLogin();
                  }}
                >
                  <span></span>
                  <p>Sign in</p>
                </Link>
                <span
                  className="material-symbols-outlined"
                  id="close-icon"
                  onClick={() => {
                    setOpenDropdown(false);
                  }}
                >
                  {openDropdown === false ? "menu" : "close"}
                </span>
              </div>
              <div className="dropdown-links">
                <NavLink to={"/"}>Home</NavLink>
                <NavLink to={"/about"}>About</NavLink>
                <NavLink to={"/services"}>Services</NavLink>
                <NavLink to={"/tickets"}>Tickets</NavLink>
                <NavLink to={"/contact"}>Contact</NavLink>
                <Link to={"/booking"}>
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
              <button onClick={handleLogin}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            {auth === "login" ? (
              <div className="login">
                <h1>Login</h1>
                <form>
                  <div className="form-div">
                    <label htmlFor="login-email">Email address</label>
                    <span>
                      <span className="material-symbols-outlined">mail</span>
                      <input
                        type="email"
                        name="login-email"
                        id="login-email"
                        placeholder="your@email.com"
                        required
                      />
                    </span>
                  </div>
                  <div className="form-div">
                    <label htmlFor="login-pass">Password</label>
                    <span>
                      <span className="material-symbols-outlined">lock</span>
                      <input
                        type="password"
                        name="login-pass"
                        id="login-pass"
                        placeholder="********"
                        required
                      />
                    </span>
                  </div>
                  <span>
                    <input type="checkbox" name="show-pass" id="show-pass" />
                    <label htmlFor="show-pass">Show Password</label>
                  </span>
                  <button>Sign in</button>
                </form>
                <p>
                  Don't have an account?{" "}
                  <Link
                    onClick={(e) => {
                      e.preventDefault();
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
                <form>
                  <div className="form-div">
                    <label htmlFor="register-email">Email address</label>
                    <span>
                      <span className="material-symbols-outlined">mail</span>
                      <input
                        type="email"
                        name="register-email"
                        id="register-email"
                        placeholder="your@email.com"
                        required
                      />
                    </span>
                  </div>
                  <div className="form-div">
                    <label htmlFor="register-pass">Password</label>
                    <span>
                      <span className="material-symbols-outlined">lock</span>
                      <input
                        type="password"
                        name="register-pass"
                        id="register-pass"
                        placeholder="********"
                        required
                      />
                    </span>
                  </div>
                  <div className="form-div">
                    <label htmlFor="confirm-pass">Confirm password</label>
                    <span>
                      <span className="material-symbols-outlined">
                        lock_open
                      </span>
                      <input
                        type="password"
                        name="confirm-pass"
                        id="confirm-pass"
                        placeholder="********"
                        required
                      />
                    </span>
                  </div>
                  <span>
                    <input type="checkbox" name="agree" id="agree" />
                    <label htmlFor="agree">
                      <Link to={"/register/terms-and-conditions"}>
                        Agree to the terms and conditions
                      </Link>
                    </label>
                  </span>
                  <button type="submit">Register</button>
                </form>
                <p>
                  Already have an account?{" "}
                  <Link
                    onClick={(e) => {
                      e.preventDefault();
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
