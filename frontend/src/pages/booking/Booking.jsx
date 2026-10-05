import React from "react";
import "./booking.css";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

function Booking() {
  return (
    <>
      <Header />
      <div className="booking">
        <h1>Booking</h1>
        <p>Grab your ticket now</p>
        <form>
          <span>
            <label>Type:</label>
            <div className="types">
              <span>
                <input type="radio" name="local-transit" id="local-transit" />
                <label htmlFor="local-transit">Local transit</label>
              </span>
              <span>
                <input type="radio" name="private" id="private" />
                <label htmlFor="private">Personal booking</label>
              </span>
              <span>
                <input type="radio" name="carrier" id="carrier" />
                <label htmlFor="carrier">Carrier services</label>
              </span>
              <span>
                <input type="radio" name="rental" id="rental" />
                <label htmlFor="local-transit">Car hire</label>
              </span>
            </div>
          </span>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default Booking;
