import React from "react";
import "./admin-header.css";

function AdminHeader({ onMenuToggle }) {
  const admin = JSON.parse(localStorage.getItem("mobilix_admin") || "{}");
  const adminName = admin.name || "Administrator";

  return (
    <>
      <div className="header">
        <div className="header-container">
          <button
            type="button"
            className="admin-menu-btn"
            aria-label="Toggle menu"
            onClick={onMenuToggle}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>

          <div className="hello">
            <h1>Hello {adminName}</h1>
            <p>System administrator</p>
          </div>
          <span id="dp"></span>
        </div>
      </div>
    </>
  );
}

export default AdminHeader;
