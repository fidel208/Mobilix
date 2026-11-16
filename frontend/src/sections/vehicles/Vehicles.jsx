import React, { useState, useEffect } from "react";
import "./vehicles.css";
import API from "../../services/api";

function Vehicles() {
  const [vehicleModal, setVehicleModal] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");

  // Form fields
  const [vehicleName, setVehicleName] = useState("");
  const [plate, setPlate] = useState("");
  const [serviceType, setServiceType] = useState("local-transit");

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await API.get("/vehicles");
      setVehicles(response.data?.vehicles || []);
    } catch (err) {
      console.error("Failed to fetch vehicles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleVehiclesModal = () => {
    setVehicleModal(!vehicleModal);
    setError("");
    setVehicleName("");
    setPlate("");
    setServiceType("local-transit");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError("");

    try {
      const response = await API.post("/vehicles", {
        name: vehicleName,
        plate,
        serviceType,
      });

      if (response.data?.vehicle) {
        setVehicles((prev) => [response.data.vehicle, ...prev]);
        setVehicleModal(false);
        setVehicleName("");
        setPlate("");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add vehicle.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;
    try {
      await API.delete(`/vehicles/${id}`);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete vehicle.");
    }
  };

  const filteredVehicles = vehicles.filter((v) =>
    `${v.name} ${v.plate} ${v.serviceType}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const lastRowIndex = currentPage * rowsPerPage;
  const firstRowIndex = lastRowIndex - rowsPerPage;
  const currentRows = filteredVehicles.slice(firstRowIndex, lastRowIndex);
  const totalPages = Math.ceil(filteredVehicles.length / rowsPerPage) || 1;

  const formatServiceType = (st) => {
    if (!st) return "";
    return st
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  return (
    <>
      <div className="vehicles">
        <div className="vehicles-container">
          <h1>Vehicles</h1>
          <div className="search-div">
            <span id="search-input">
              <span className="material-symbols-outlined">search</span>
              <input
                type="search"
                placeholder="Search for a vehicle"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </span>
            <button type="button" onClick={handleVehiclesModal}>
              <span className="material-symbols-outlined">add</span>Add a new vehicle
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
                {loading ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                      Loading vehicles...
                    </td>
                  </tr>
                ) : currentRows.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                      {searchQuery ? "No vehicles match your search." : "No vehicles added yet."}
                    </td>
                  </tr>
                ) : (
                  currentRows.map((v) => (
                    <tr key={v.id}>
                      <td>{v.name}</td>
                      <td>{formatServiceType(v.serviceType)}</td>
                      <td>{v.plate}</td>
                      <td>
                        <button
                          id="delete-btn"
                          type="button"
                          onClick={() => handleDelete(v.id)}
                          title="Delete vehicle"
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
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
              <p>Add a vehicle</p>
              <button type="button" onClick={handleVehiclesModal}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            {error && (
              <p style={{ color: "red", padding: "0 20px", margin: 0, fontSize: "14px" }}>
                {error}
              </p>
            )}
            <form onSubmit={handleSubmit}>
              <span>
                <label htmlFor="vehicle-name">Vehicle name</label>
                <input
                  type="text"
                  name="vehicle-name"
                  id="vehicle-name"
                  placeholder="e.g. Tuktuk, Noah, Bus"
                  value={vehicleName}
                  onChange={(e) => setVehicleName(e.target.value)}
                  required
                />
              </span>
              <span>
                <label htmlFor="plate">Number plate</label>
                <input
                  type="text"
                  name="plate"
                  id="plate"
                  placeholder="e.g. KDH 245Z"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value)}
                  required
                />
              </span>
              <span>
                <label htmlFor="service-type">Service type</label>
                <select
                  name="service-type"
                  id="service-type"
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  required
                >
                  <option value="local-transit">Local transit</option>
                  <option value="private-booking">Private booking</option>
                  <option value="car-hire">Car hire</option>
                  <option value="carrier">Carrier services</option>
                </select>
              </span>
              <button id="form-submit-btn" type="submit" disabled={formLoading}>
                {formLoading ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Vehicles;
