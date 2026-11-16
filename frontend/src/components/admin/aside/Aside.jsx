import React from "react";
import "./aside.css";
import { Link, NavLink } from "react-router-dom";

function Aside({ isOpen, onClose }) {
  return (
    <>
      <div
        className={`admin-aside-backdrop ${isOpen ? "show" : ""}`}
        onClick={onClose}
      ></div>

      <aside className={isOpen ? "open" : ""}>
        <div className="aside-top">
          <button
            type="button"
            className="aside-close-btn"
            aria-label="Close menu"
            onClick={onClose}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="aside-bottom">
          <div className="aside-links">
            <NavLink to={"/admin/portal/dashboard"} onClick={onClose}>
              <span className="material-symbols-outlined">dashboard</span>
              Dashboard
            </NavLink>
            <NavLink to={"/admin/portal/services"} onClick={onClose}>
              <span className="material-symbols-outlined">handyman</span>
              Services
            </NavLink>
            <NavLink to={"/admin/portal/routes"} onClick={onClose}>
              <span className="material-symbols-outlined">alt_route</span>
              Routes
            </NavLink>
            <NavLink to={"/admin/portal/vehicles"} onClick={onClose}>
              <span className="material-symbols-outlined">transportation</span>
              Vehicles
            </NavLink>
            <NavLink to={"/admin/portal/tickets"} onClick={onClose}>
              <span className="material-symbols-outlined">local_activity</span>
              Tickets
            </NavLink>
            <NavLink to={"/admin/portal/community"} onClick={onClose}>
              <span className="material-symbols-outlined">groups</span>
              Community
            </NavLink>
          </div>
          <Link
            to={"/admin/portal/auth"}
            id="logout-link"
            onClick={() => {
              localStorage.removeItem("mobilix_token");
              localStorage.removeItem("mobilix_admin");
              onClose();
            }}
          >
            <span className="material-symbols-outlined">logout</span>Logout
          </Link>
        </div>
      </aside>
    </>
  );
}

export default Aside;
