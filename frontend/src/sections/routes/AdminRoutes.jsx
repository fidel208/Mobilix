import React, { useState } from "react";
import "./admin-routes.css";

function AdminRoutes() {
  const [routes, setRoutes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const lastRowIndex = currentPage * rowsPerPage;
  const firstRowIndex = lastRowIndex - rowsPerPage;

  const currentRows = routes.slice(firstRowIndex, lastRowIndex);
  const totalPages = Math.ceil(routes.length / rowsPerPage) || 1;
  return (
    <>
      <div className="admin-routes">
        <div className="routes-container">
          <h1>Routes</h1>
          <div className="search-div">
            <span id="search-input">
              <span className="material-symbols-outlined">search</span>
              <input type="search" placeholder="Search for a route"></input>
            </span>
            <button type="button">
              <span className="material-symbols-outlined">add</span>Add a new
              route
            </button>
          </div>
          <div className="routes-table-cont">
            <table className="routes-table">
              <thead>
                <tr>
                  <th>Starting point</th>
                  <th>Destination</th>
                  <th>Service type</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Kwale</td>
                  <td>Kombani</td>
                  <td>Local transit</td>
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

export default AdminRoutes;
