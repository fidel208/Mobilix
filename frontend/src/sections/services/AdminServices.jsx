import React, { useState, useEffect } from "react";
import "./admin-services.css";
import API from "../../services/api";

function AdminServices() {
  const [servicesModal, setServicesModal] = useState(false);
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");

  
  const [serviceName, setServiceName] = useState("");
  const [serviceDesc, setServiceDesc] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await API.get("/services");
      setServices(response.data?.services || []);
    } catch (err) {
      console.error("Failed to fetch services:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleServicesModal = () => {
    setServicesModal(!servicesModal);
    setError("");
    setServiceName("");
    setServiceDesc("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError("");

    try {
      const response = await API.post("/services", {
        name: serviceName,
        description: serviceDesc,
      });

      if (response.data?.service) {
        setServices((prev) => [response.data.service, ...prev]);
        setServicesModal(false);
        setServiceName("");
        setServiceDesc("");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create service.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      await API.delete(`/services/${id}`);
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete service.");
    }
  };

  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lastRowIndex = currentPage * rowsPerPage;
  const firstRowIndex = lastRowIndex - rowsPerPage;
  const currentRows = filteredServices.slice(firstRowIndex, lastRowIndex);
  const totalPages = Math.ceil(filteredServices.length / rowsPerPage) || 1;

  return (
    <>
      <div className="admin-services">
        <div className="admin-services-container">
          <h1>Services</h1>
          <div className="search-div">
            <span id="search-input">
              <span className="material-symbols-outlined">search</span>
              <input
                type="search"
                placeholder="Search for a service"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </span>
            <button type="button" onClick={handleServicesModal}>
              <span className="material-symbols-outlined">add</span>Add a new service
            </button>
          </div>
          <div className="services-table-cont">
            <table className="services-table">
              <thead>
                <tr>
                  <th>Service name</th>
                  <th>Number of routes</th>
                  <th>Tickets booked</th>
                  <th>Revenue generated</th>
                  <th>Modify</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                      Loading services...
                    </td>
                  </tr>
                ) : currentRows.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                      {searchQuery ? "No services match your search." : "No services added yet."}
                    </td>
                  </tr>
                ) : (
                  currentRows.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.routesCount || 0}</td>
                      <td>{item.ticketsBooked || 0}</td>
                      <td>Ksh. {Number(item.revenue || 0).toLocaleString()}</td>
                      <td>
                        <button
                          id="delete-btn"
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          title="Delete service"
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
      {servicesModal && (
        <div className="services-overlay">
          <div className="services-modal">
            <div className="modal-top">
              <p>Add a service</p>
              <button type="button" onClick={handleServicesModal}>
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
                <label htmlFor="service-name">Service name</label>
                <input
                  type="text"
                  name="service-name"
                  id="service-name"
                  placeholder="e.g. Local transit, Car hire"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  required
                />
              </span>
              <span>
                <label htmlFor="service-desc">Description</label>
                <textarea
                  name="service-desc"
                  id="service-desc"
                  placeholder="Service description..."
                  value={serviceDesc}
                  onChange={(e) => setServiceDesc(e.target.value)}
                  required
                ></textarea>
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

export default AdminServices;
