import React from "react";
import "./admin.css";
import Aside from "../../../components/admin/aside/Aside";
import AdminHeader from "../../../components/admin/admin-header/AdminHeader";
import { Outlet } from "react-router-dom";

function Admin() {
  return (
    <>
      <div className="admin">
        <div className="admin-container">
          <Aside />
          <main>
            <AdminHeader />
            <Outlet></Outlet>
          </main>
        </div>
      </div>
    </>
  );
}

export default Admin;
