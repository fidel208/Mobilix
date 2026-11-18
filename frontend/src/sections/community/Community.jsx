import React, { useState, useEffect } from "react";
import "./community.css";
import API from "../../services/api";

function Community() {
  const [communityModal, setCommunityModal] = useState(false);
  const [community, setCommunity] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");

  
  const [clientEmail, setClientEmail] = useState("");
  const [status, setStatus] = useState("subscribed");

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const fetchCommunity = async () => {
    setLoading(true);
    try {
      const response = await API.get("/community");
      setCommunity(response.data?.members || []);
    } catch (err) {
      console.error("Failed to fetch community members:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunity();
  }, []);

  const handleCommunityModal = () => {
    setCommunityModal(!communityModal);
    setError("");
    setClientEmail("");
    setStatus("subscribed");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError("");

    try {
      const response = await API.post("/community", {
        email: clientEmail,
        status,
      });

      if (response.data?.member) {
        setCommunity((prev) => [response.data.member, ...prev]);
        setCommunityModal(false);
        setClientEmail("");
        setStatus("subscribed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add community member.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;
    try {
      await API.delete(`/community/${id}`);
      setCommunity((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete member.");
    }
  };

  const filteredCommunity = community.filter((m) =>
    `${m.email} ${m.status}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lastRowIndex = currentPage * rowsPerPage;
  const firstRowIndex = lastRowIndex - rowsPerPage;
  const currentRows = filteredCommunity.slice(firstRowIndex, lastRowIndex);
  const totalPages = Math.ceil(filteredCommunity.length / rowsPerPage) || 1;

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleString("en-US", {
      weekday: "short",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <>
      <div className="community">
        <div className="community-container">
          <h1>Community</h1>
          <div className="search-div">
            <span id="search-input">
              <span className="material-symbols-outlined">search</span>
              <input
                type="search"
                placeholder="Search for a member"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </span>
            <button type="button" onClick={handleCommunityModal}>
              <span className="material-symbols-outlined">add</span>Add a new member
            </button>
          </div>
          <div className="community-table-cont">
            <table className="community-table">
              <thead>
                <tr>
                  <th>Email address</th>
                  <th>Status</th>
                  <th>Date joined</th>
                  <th>Modify</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                      Loading community members...
                    </td>
                  </tr>
                ) : currentRows.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                      {searchQuery
                        ? "No members match your search."
                        : "No community members added yet."}
                    </td>
                  </tr>
                ) : (
                  currentRows.map((m) => (
                    <tr key={m.id}>
                      <td>{m.email}</td>
                      <td>
                        <span
                          style={{
                            color: m.status === "subscribed" ? "#10b981" : "#f59e0b",
                            textTransform: "capitalize",
                          }}
                        >
                          {m.status}
                        </span>
                      </td>
                      <td>{formatDate(m.createdAt)}</td>
                      <td>
                        <button
                          id="delete-btn"
                          type="button"
                          onClick={() => handleDelete(m.id)}
                          title="Remove member"
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
      {communityModal && (
        <div className="community-overlay">
          <div className="community-modal">
            <div className="modal-top">
              <p>Add a member</p>
              <button type="button" onClick={handleCommunityModal}>
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
                <label htmlFor="client-email">Email address</label>
                <input
                  type="email"
                  name="client-email"
                  id="client-email"
                  placeholder="e.g. member@email.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  required
                />
              </span>
              <span>
                <label htmlFor="status">Status</label>
                <select
                  name="status"
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="subscribed">Subscribed</option>
                  <option value="not-subscribed">Not subscribed</option>
                </select>
              </span>
              <button type="submit" id="form-submit-btn" disabled={formLoading}>
                {formLoading ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Community;
