import React, { useState } from "react";
import "./admin-routes.css";

function AdminRoutes() {
  const [routesModal, setRoutesModal] = useState(false);
  const handleRoutes = () => {
    if (routesModal === false) {
      setRoutesModal(true);
    } else {
      setRoutesModal(false);
    }
  };

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
            <button type="button" onClick={handleRoutes}>
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
                  <th>Modify</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Kwale</td>
                  <td>Kombani</td>
                  <td>Local transit</td>
                  <td>100</td>
                  <td>
                    <button id="delete-btn">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </td>
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
      {routesModal && (
        <div className="routes-overlay">
          <div className="routes-modal">
            <div className="modal-top">
              <p>Add a client</p>
              <button onClick={handleRoutes}>
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
            <form>
              <span>
                <label htmlFor="starting-point">Starting point</label>
                <input type="text" name="starting-point" id="starting-point" />
              </span>
              <span>
                <label htmlFor="destination">Destination</label>
                <input type="text" name="destination" id="destination" />
              </span>
              <span>
                <label htmlFor="price">Price</label>
                <input type="number" name="price" id="price" />
              </span>
              <span>
                <label htmlFor="servicee-type">Service type</label>
                <select name="service-type" id="service-type">
                  <option value="local-transit">Local transit</option>
                  <option value="private-booking">Private booking</option>
                  <option value="car-hire">Car hire</option>
                  <option value="carrier">Carrier services</option>
                </select>
              </span>
              <button>Submit</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminRoutes;
