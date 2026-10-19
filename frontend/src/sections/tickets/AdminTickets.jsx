import React, { useState } from "react";
import "./admin-tickets.css";

function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const lastRowIndex = currentPage * rowsPerPage;
  const firstRowIndex = lastRowIndex - rowsPerPage;

  const currentRows = tickets.slice(firstRowIndex, lastRowIndex);
  const totalPages = Math.ceil(tickets.length / rowsPerPage) || 1;

  return (
    <>
      <div className="admin-tickets">
        <div className="tickets-container">
          <h1>Tickets</h1>
          <div className="search-div">
            <span id="search-input">
              <span className="material-symbols-outlined">search</span>
              <input type="search" placeholder="Search for a ticket"></input>
            </span>
            <button type="button">
              <span className="material-symbols-outlined">add</span>Add a new
              ticket
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
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>9888262GH</td>
                  <td>Fidel</td>
                  <td>Muthomi</td>
                  <td>0789455874</td>
                  <td>UIE63738SJ</td>
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

export default AdminTickets;
