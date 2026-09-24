import React from "react";
import "./tickets.css";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

function Tickets() {
  return (
    <>
      <Header />
      <div className="tickets">
        <div className="search-ticket">
          <h1>Print a ticket</h1>
          <form id="search">
            <input
              type="text"
              id="ticket"
              name="ticket"
              placeholder="Enter your ticket number"
            />
            <button>
              <i className="fa-solid fa-magnifying-glass"></i> Search ticket
            </button>
          </form>
          <button id="download-ticket">Download ticket</button>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Tickets;
