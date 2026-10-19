import React from "react";
import "./admin-header.css";

function AdminHeader() {
  return (
    <>
      <div className="header">
        <div className="header-container">
          <div className="hello">
            <h1>Hello Mwitixo</h1>
            <p>System administrator</p>
          </div>
          <span id="dp"></span>
        </div>
      </div>
    </>
  );
}

export default AdminHeader;
