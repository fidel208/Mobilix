import React, { useState, useEffect } from "react";
import "./admin-tickets.css";
import API from "../../services/api";

function AdminTickets() {
  const [adminTicketsModal, setAdminTicketsModal] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");

  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [refCode, setRefCode] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await API.get("/tickets");
      setTickets(response.data?.tickets || []);
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleTicketsModal = () => {
    setAdminTicketsModal(!adminTicketsModal);
    setError("");
    setFirstName("");
    setLastName("");
    setPhone("");
    setAmount("");
    setRefCode("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError("");

    try {
      const response = await API.post("/tickets", {
        firstName,
        lastName,
        phone,
        amount,
        refCode,
      });

      if (response.data?.ticket) {
        setTickets((prev) => [response.data.ticket, ...prev]);
        setAdminTicketsModal(false);
        setFirstName("");
        setLastName("");
        setPhone("");
        setAmount("");
        setRefCode("");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create ticket.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;
    try {
      await API.delete(`/tickets/${id}`);
      setTickets((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete ticket.");
    }
  };

  const filteredTickets = tickets.filter((t) => {
    const search = searchQuery.toLowerCase();
    return (
      (t.ticketNumber && t.ticketNumber.toLowerCase().includes(search)) ||
      (t.passengerName && t.passengerName.toLowerCase().includes(search)) ||
      (t.phoneNumber && t.phoneNumber.toLowerCase().includes(search)) ||
      (t.mpesaRefCode && t.mpesaRefCode.toLowerCase().includes(search))
    );
  });

  const lastRowIndex = currentPage * rowsPerPage;
  const firstRowIndex = lastRowIndex - rowsPerPage;
  const currentRows = filteredTickets.slice(firstRowIndex, lastRowIndex);
  const totalPages = Math.ceil(filteredTickets.length / rowsPerPage) || 1;

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
      <div className="admin-tickets">
        <div className="tickets-container">
          <h1>Tickets</h1>
          <div className="search-div">
            <span id="search-input">
              <span className="material-symbols-outlined">search</span>
              <input
                type="search"
                placeholder="Search for a ticket"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </span>
            <button type="button" onClick={handleTicketsModal}>
              <span className="material-symbols-outlined">add</span>Add a new ticket
            </button>
          </div>
          <div className="tickets-table-cont">
            <table className="tickets-table">
              <thead>
                <tr>
                  <th>Ticket number</th>
                  <th>First name</th>
                  <th>Last name</th>
                  <th>Phone number</th>
                  <th>Reference code</th>
                  <th>Date created</th>
                  <th>Modify</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                      Loading tickets...
                    </td>
                  </tr>
                ) : currentRows.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                      {searchQuery ? "No tickets match your search." : "No tickets created yet."}
                    </td>
                  </tr>
                ) : (
                  currentRows.map((t) => {
                    const nameParts = (t.passengerName || "").split(" ");
                    const fName = nameParts[0] || "";
                    const lName = nameParts.slice(1).join(" ") || "";

                    return (
                      <tr key={t.id}>
                        <td>{t.ticketNumber}</td>
                        <td>{fName}</td>
                        <td>{lName}</td>
                        <td>{t.phoneNumber}</td>
                        <td>{t.mpesaRefCode || "N/A"}</td>
                        <td>{formatDate(t.createdAt)}</td>
                        <td>
                          <button
                            id="delete-btn"
                            type="button"
                            onClick={() => handleDelete(t.id)}
                            title="Delete ticket"
                          >
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
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
      {adminTicketsModal && (
        <div className="tickets-overlay">
          <div className="ticket-modal">
            <div className="modal-top">
              <p>Add a ticket</p>
              <button type="button" onClick={handleTicketsModal}>
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
                <label htmlFor="first-name">First name</label>
                <input
                  type="text"
                  name="first-name"
                  id="first-name"
                  placeholder="e.g. John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </span>
              <span>
                <label htmlFor="last-name">Last name</label>
                <input
                  type="text"
                  name="last-name"
                  id="last-name"
                  placeholder="e.g. Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </span>
              <span>
                <label htmlFor="phone">Phone number</label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  placeholder="e.g. 0712345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </span>
              <span>
                <label htmlFor="ticket-amount">Amount (Ksh)</label>
                <input
                  type="number"
                  name="ticket-amount"
                  id="ticket-amount"
                  placeholder="e.g. 500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </span>
              <span>
                <label htmlFor="ref-code">Reference code</label>
                <input
                  type="text"
                  name="ref-code"
                  id="ref-code"
                  placeholder="e.g. UIE63738SJ (optional)"
                  value={refCode}
                  onChange={(e) => setRefCode(e.target.value)}
                />
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

export default AdminTickets;
