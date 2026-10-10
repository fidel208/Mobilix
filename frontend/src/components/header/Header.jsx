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
        <div className="login-modal" onClick={handleLogin}>
          <div className="login-container"></div>
        </div>
      )}
    </>
  );
}

export default Header;
