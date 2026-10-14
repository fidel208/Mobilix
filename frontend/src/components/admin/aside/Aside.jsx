import React from "react";
import "./aside.css";
import { Link, NavLink } from "react-router-dom";

function Aside() {
  return (
    <>
      <aside>
        <div className="aside-top"></div>
        <div className="aside-bottom">
          <div className="aside-links">
            <NavLink to={"/admin/portal/dashboard"}>
              <span className="material-symbols-outlined">dashboard</span>
              Dashboard
            </NavLink>
            <NavLink to={"/admin/portal/services"}>
              <span className="material-symbols-outlined">handyman</span>
              Services
            </NavLink>
            <NavLink to={"/admin/portal/routes"}>
              <span className="material-symbols-outlined">alt_route</span>
              Routes
            </NavLink>
            <NavLink to={"/admin/portal/tickets"}>
              <span className="material-symbols-outlined">local_activity</span>
              Tickets
            </NavLink>
            <NavLink to={"/admin/portal/community"}>
              <span className="material-symbols-outlined">groups</span>
              Community
            </NavLink>
          </div>
          <Link to={"/admin/portal/auth"} id="logout-link">
            <span className="material-symbols-outlined">logout</span>Logout
          </Link>
        </div>
      </aside>
    </>
  );
}

export default Aside;
