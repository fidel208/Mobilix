import { useState, useEffect } from "react";
import "./admin-routes.css";
import API from "../../services/api";

function AdminRoutes() {
  const [routesModal, setRoutesModal] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");

  const [startingPoint, setStartingPoint] = useState("");
  const [destination, setDestination] = useState("");
  const [price, setPrice] = useState("");
  const [serviceType, setServiceType] = useState("local-transit");

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const response = await API.get("/routes");
      setRoutes(response.data?.routes || []);
    } catch (err) {
      console.error("Failed to fetch routes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleRoutesModal = () => {
    setRoutesModal(!routesModal);
    setError("");
    setStartingPoint("");
    setDestination("");
    setPrice("");
    setServiceType("local-transit");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError("");

    try {
      const response = await API.post("/routes", {
        startingPoint,
        destination,
        price,
        serviceType,
      });

      if (response.data?.route) {
        setRoutes((prev) => [response.data.route, ...prev]);
        setRoutesModal(false);
        setStartingPoint("");
        setDestination("");
        setPrice("");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create route.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this route?")) return;
    try {
      await API.delete(`/routes/${id}`);
      setRoutes((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete route.");
    }
  };

  const filteredRoutes = routes.filter((r) =>
    `${r.startingPoint} ${r.destination} ${r.serviceType}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  const lastRowIndex = currentPage * rowsPerPage;
  const firstRowIndex = lastRowIndex - rowsPerPage;
  const currentRows = filteredRoutes.slice(firstRowIndex, lastRowIndex);
  const totalPages = Math.ceil(filteredRoutes.length / rowsPerPage) || 1;

  const formatServiceType = (st) => {
    if (!st) return "";
    return st
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  return (
    <>
      <div className="admin-routes">
        <div className="routes-container">
          <h1>Routes</h1>
          <div className="search-div">
            <span id="search-input">
              <span className="material-symbols-outlined">search</span>
              <input
                type="search"
                placeholder="Search for a route"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </span>
            <button type="button" onClick={handleRoutesModal}>
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
                {loading ? (
                  <tr>
                    <td
                      colSpan="5"
                      style={{ textAlign: "center", padding: "20px" }}
                    >
                      Loading routes...
                    </td>
                  </tr>
                ) : currentRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      style={{ textAlign: "center", padding: "20px" }}
                    >
                      {searchQuery
                        ? "No routes match your search."
                        : "No routes added yet."}
                    </td>
                  </tr>
                ) : (
                  currentRows.map((r) => (
                    <tr key={r.id}>
                      <td>{r.startingPoint}</td>
                      <td>{r.destination}</td>
                      <td>{formatServiceType(r.serviceType)}</td>
                      <td>Ksh. {Number(r.price).toLocaleString()}</td>
                      <td>
                        <button
                          id="delete-btn"
                          type="button"
                          onClick={() => handleDelete(r.id)}
                          title="Delete route"
                        >
                          <span className="material-symbols-outlined">
                            delete
                          </span>
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
      {routesModal && (
        <div className="routes-overlay">
          <div className="routes-modal">
            <div className="modal-top">
              <p>Add a route</p>
              <button type="button" onClick={handleRoutesModal}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            {error && (
              <p
                style={{
                  color: "red",
                  padding: "0 20px",
                  margin: 0,
                  fontSize: "14px",
                }}
              >
                {error}
              </p>
            )}
            <form onSubmit={handleSubmit}>
              <span>
                <label htmlFor="starting-point">Starting point</label>
                <input
                  type="text"
                  name="starting-point"
                  id="starting-point"
                  placeholder="e.g. Kwale"
                  value={startingPoint}
                  onChange={(e) => setStartingPoint(e.target.value)}
                  required
                />
              </span>
              <span>
                <label htmlFor="destination">Destination</label>
                <input
                  type="text"
                  name="destination"
                  id="destination"
                  placeholder="e.g. Kombani"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                />
              </span>
              <span>
                <label htmlFor="price">Price (Ksh)</label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  placeholder="e.g. 100"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
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

export default AdminRoutes;
