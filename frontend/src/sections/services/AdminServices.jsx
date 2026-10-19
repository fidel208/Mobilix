import React, { useState } from "react";
import "./admin-services.css";

function AdminServices() {
  const [services, setServices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const lastRowIndex = currentPage * rowsPerPage;
  const firstRowIndex = lastRowIndex - rowsPerPage;

  const currentRows = services.slice(firstRowIndex, lastRowIndex);
  const totalPages = Math.ceil(services.length / rowsPerPage) || 1;
  return (
    <>
      <div className="admin-services">
        <div className="admin-services-container">
          <h1>Services</h1>
          <div className="search-div">
            <span id="search-input">
              <span className="material-symbols-outlined">search</span>
              <input type="search" placeholder="Search for a services"></input>
            </span>
            <button type="button">
              <span className="material-symbols-outlined">add</span>Add a new
              service
            </button>
          </div>
          <div className="services-table-cont">
            <table className="services-table">
              <thead>
                <tr>
                  <th>Service name</th>
                  <th>Date created</th>
                  <th>Number of routes</th>
                  <th>Tickets booked</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Local transit</td>
                  <td>Tuesday 12:45pm</td>
                  <td>5</td>
                  <td>100</td>
                </tr>
              </tbody>
            </table>
            <div className="pagination-controls">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="page-btn"
              >
                <i className="fa-solid fa-angle-left"></i> Previous
              </button>
              <span className="page-number">
                Page <b>{currentPage}</b> of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="page-btn"
              >
                Next <i className="fa-solid fa-angle-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminServices;
