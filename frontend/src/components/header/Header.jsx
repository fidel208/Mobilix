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
        </nav>
        <button id="menu-icon" onClick={handleDropdown}>
          <span className="material-symbols-outlined">
            {openDropdown === false ? "menu" : "close"}
          </span>
        </button>
        {openDropdown && (
          <div className="nav-dropdown">
            <Link to={"/"}>Home</Link>
            <Link to={"/about"}>About</Link>
            <Link to={"/services"}>Services</Link>
            <Link to={"/tickets"}>Tickets</Link>
            <Link to={"/contact"}>Contact</Link>
            <Link to={"/booking"}>
              <button>Booking</button>
            </Link>
          </div>
        )}
      </header>
    </>
  );
}

export default Header;
