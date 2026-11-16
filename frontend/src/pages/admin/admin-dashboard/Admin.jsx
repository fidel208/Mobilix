import React, { useState } from "react";
import "./admin.css";
import Aside from "../../../components/admin/aside/Aside";
import AdminHeader from "../../../components/admin/admin-header/AdminHeader";
import { Outlet } from "react-router-dom";

function Admin() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="admin">
        <div className={`admin-container ${menuOpen ? "menu-open" : ""}`}>
          <Aside isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
          <main>
            <AdminHeader onMenuToggle={() => setMenuOpen((prev) => !prev)} />
            <Outlet></Outlet>
          </main>
        </div>
      </div>
    </>
  );
}

export default Admin;
