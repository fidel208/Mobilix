import { useState } from "react";
import "./tickets.css";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import API from "../../services/api";

function Tickets() {
  const [searchQuery, setSearchQuery] = useState("");
  const [ticketData, setTicketData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError("");
    setTicketData(null);

    try {
      const response = await API.get(
        `/tickets/search?query=${encodeURIComponent(searchQuery)}`,
      );
      setTicketData(response.data.ticket);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(
        err.response?.data?.message ||
          "Ticket not found. Please check your ticket number.",
      );
    }
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <>
      <Header />
      <div className="tickets">
        <div className="search-ticket">
          <h1>Print a ticket</h1>
          <form id="search" onSubmit={handleSearch}>
            <input
              type="text"
              id="ticket"
              name="ticket"
              placeholder="Enter your ticket number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              <i className="fa-solid fa-magnifying-glass"></i>{" "}
              {loading ? "Searching..." : "Search ticket"}
            </button>
          </form>

          {error && (
            <p
              className="error-message"
              style={{ color: "red", marginTop: "10px" }}
            >
              {error}
            </p>
          )}

          {ticketData && (
            <div className="ticket-result-card">
              <h3>Mobilix Ticket Details</h3>
              <p>Ticket number:{ticketData.ticketNumber}</p>
              <p>Passenger name:{ticketData.passengerName}</p>
              <p>Phone number:{ticketData.phoneNumber}</p>
              <p>Route:{ticketData.route}</p>
              <p>Travel date: {ticketData.travelDate}</p>
              <p>Seats: {ticketData.seats}</p>
              <p>Reference: {ticketData.mpesaRefCode}</p>
              <p>Status: {ticketData.status}</p>
            </div>
          )}

          {ticketData && (
            <button
              id="download-ticket"
              type="button"
              onClick={handleDownloadPDF}
              style={{ marginTop: "15px" }}
            >
              Download ticket
            </button>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Tickets;
