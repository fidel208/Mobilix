import React, { useState } from "react";
import "./vehicles.css";

function Vehicles() {
  const [vehicleModal, setVehicleModal] = useState(false);
  const handleVehicles = () => {
    if (vehicleModal === false) {
      setVehicleModal(true);
    } else {
      setVehicleModal(false);
    }
  };

  const [vehicles, setVehicles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const lastRowIndex = currentPage * rowsPerPage;
  const firstRowIndex = lastRowIndex - rowsPerPage;

  const currentRows = vehicles.slice(firstRowIndex, lastRowIndex);
  const totalPages = Math.ceil(vehicles.length / rowsPerPage) || 1;
  return (
    <>
      <div className="vehicles">
        <div className="vehicles-container">
          <h1>Vehicles</h1>
          <div className="search-div">
            <span id="search-input">
              <span className="material-symbols-outlined">search</span>
              <input type="search" placeholder="Search for a services"></input>
            </span>
            <button type="button" onClick={handleVehicles}>
              <span className="material-symbols-outlined">add</span>Add a new
              vehicle
            </button>
          </div>
          <div className="vehicles-table-cont">
            <table className="vehicles-table">
              <thead>
                <tr>
                  <th>Vehicle name</th>
                  <th>Service type</th>
                  <th>Number plate</th>
                  <th>Modify</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Tuktuk</td>
                  <td>Local transit</td>
                  <td>KDH245Z</td>
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
      {vehicleModal && (
        <div className="vehicles-overlay">
          <div className="vehicle-modal">
            <div className="modal-top">
              <p>Add a client</p>
              <button onClick={handleVehicles}>
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
            <form>
              <span>
                <label htmlFor="vehicle-name">Vehicle name</label>
                <input type="text" name="vehicle-name" id="vehicle-name" />
              </span>
              <span>
                <label htmlFor="plate">Number plate</label>
                <input type="text" name="plate" id="plate" />
              </span>
              <span>
                <label htmlFor="service-type">Service type</label>
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

export default Vehicles;
