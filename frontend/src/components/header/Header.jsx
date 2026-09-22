import React from "react";
import "./header.css";
import { Link, NavLink } from "react-router-dom";

function Header() {
  return (
    <>
      <header>
        <div className="head-one">
          <img src="public/Mobilix-transaparent.png" alt="mobilix-logo" />
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
      </header>
    </>
  );
}

export default Header;
