import React, { useState } from "react";
import "./booking.css";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { Link } from "react-router-dom";

function Booking() {
  const [type, setType] = useState("local");
  const [days, setDays] = useState("one");

  const handleType = (e) => {
    setType(e.target.value);
  };

  const handleDays = (e) => {
    setDays(e.target.value);
  };

  const [localBookingModal, setLocalBookingModal] = useState(false);
  const handleLocalBooking = () => {
    if (localBookingModal === false) {
      setLocalBookingModal(true);
    } else {
      setLocalBookingModal(false);
    }
  };

  const [localPayTime, setLocalPayTime] = useState("now");
  const handleLocalPayTime = (e) => {
    setLocalPayTime(e.target.value);
  };

  const [privateBookingModal, setPrivateBookingModal] = useState(false);
  const handlePrivateBooking = () => {
    if (privateBookingModal === false) {
      setPrivateBookingModal(true);
    } else {
      setPrivateBookingModal(false);
    }
  };

  const [hireModal, setHireModal] = useState(false);
  const handleHire = () => {
    if (hireModal === false) {
      setHireModal(true);
    } else {
      setHireModal(false);
    }
  };

  return (
    <>
      <Header />
      <div className="booking">
        <h1>BOOKING</h1>
        <div className="ticket-booking">
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="service-type">
              <span>
                <input
                  type="radio"
                  name="type"
                  id="local"
                  value="local"
                  checked={type === "local"}
                  onChange={handleType}
                />
                <label htmlFor="local">Local transit</label>
              </span>
              <span>
                <input
                  type="radio"
                  name="type"
                  id="private"
                  value="private"
                  checked={type === "private"}
                  onChange={handleType}
                />
                <label htmlFor="private">Private booking</label>
              </span>
              <span>
                <input
                  type="radio"
                  name="type"
                  id="luggage"
                  value="luggage"
                  checked={type === "luggage"}
                  onChange={handleType}
                />
                <label htmlFor="luggage">Carrier services</label>
              </span>
            </div>
            {type === "local" && (
              <div
                className="local-div"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <p>5 seats left</p>
                <div className="inputs">
                  <span>
                    <label htmlFor="local-from">Starting point</label>
                    <select name="local-to" id="local-to" required>
                      <option value="kwale">Kwale town</option>
                      <option value="kombani">Kombani</option>
                      <option value="ukunda">Ukunda</option>
                      <option value="likoni">Likoni</option>
                    </select>
                  </span>
                  <span>
                    <label htmlFor="local-to">Destination</label>
                    <select name="local-to" id="local-to" required>
                      <option value="kwale">Kwale town</option>
                      <option value="kombani">Kombani</option>
                      <option value="ukunda">Ukunda</option>
                      <option value="likoni">Likoni</option>
                    </select>
                  </span>
                  <span>
                    <label htmlFor="local-date" required>
                      Date
                    </label>
                    <input
                      type="date"
                      name="local-date"
                      id="local-date"
                      required
                    />
                  </span>
                </div>
                <div className="form-buttons">
                  <button type="submit">Search for seats</button>
                  <button
                    type="button"
                    onClick={handleLocalBooking}
                    id="book-button"
                  >
                    Get a ticket
                  </button>
                </div>
              </div>
            )}
            {type === "private" && (
              <div className="private-div">
                <p>2 cars left</p>
                <div className="inputs">
                  <span>
                    <label htmlFor="private-from">Starting point</label>
                    <input
                      type="text"
                      name="private-from"
                      id="private-from"
                      placeholder="Eg. Kwale"
                      required
                    />
                  </span>
                  <span>
                    <label htmlFor="private-to">Destination</label>
                    <select name="private-to" id="private-to" required>
                      <option value="airstrip">Ukunda airstrip</option>
                      <option value="airport">Moi Int airport</option>
                      <option value="sgr">Mombasa SGR station</option>
                    </select>
                  </span>
                </div>
                <div className="form-buttons">
                  <button type="submit">Search for cars</button>
                  <button
                    type="button"
                    id="book-button"
                    onClick={handlePrivateBooking}
                  >
                    Reserve a seat
                  </button>
                </div>
              </div>
            )}
            {type === "luggage" && (
              <div className="luggage-div">
                <p>3 cars available</p>
                <div className="inputs">
                  <span>
                    <label htmlFor="luggage-from">Starting point</label>
                    <select name="luggage-from" id="luggage-from" required>
                      <option value="kwale">Kwale town</option>
                      <option value="kombani">Kombani</option>
                      <option value="ukunda">Ukunda</option>
                      <option value="likoni">Likoni</option>
                    </select>
                  </span>
                  <span>
                    <label htmlFor="luggage-to">Destination</label>
                    <select name="luggage-to" id="luggage-to" required>
                      <option value="kwale">Kwale town</option>
                      <option value="kombani">Kombani</option>
                      <option value="ukunda">Ukunda</option>
                      <option value="likoni">Likoni</option>
                    </select>
                  </span>
                  <span>
                    <label htmlFor="luggage-date" required>
                      Date
                    </label>
                    <input
                      type="date"
                      name="luggage-date"
                      id="luggage-date"
                      required
                    />
                  </span>
                </div>
                <button type="submit" id="luggage-book-btn">
                  Book now
                </button>
              </div>
            )}
          </form>
          {localBookingModal && (
            <div className="booking-modal">
              <form
                className="booking-container"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <div className="modal-top">
                  <p>Fill the following form</p>
                  <button onClick={handleLocalBooking}>
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
                <div className="details-form">
                  <div className="names">
                    <span>
                      <label htmlFor="first-name">First name</label>
                      <input
                        type="text"
                        name="first-name"
                        id="first-name"
                        placeholder="Enter your first name"
                        required
                      />
                    </span>
                    <span>
                      <label htmlFor="last-name">Last name</label>
                      <input
                        type="text"
                        name="last-name"
                        id="last-name"
                        placeholder="Enter your last name"
                        required
                      />
                    </span>
                  </div>
                  <div className="place">
                    <span>
                      <label htmlFor="local-from">Starting point</label>
                      <select name="local-to" id="local-to" required>
                        <option value="kwale">Kwale town</option>
                        <option value="kombani">Kombani</option>
                        <option value="ukunda">Ukunda</option>
                        <option value="likoni">Likoni</option>
                      </select>
                    </span>
                    <span>
                      <label htmlFor="local-to">Destination</label>
                      <select name="local-to" id="local-to" required>
                        <option value="kwale">Kwale town</option>
                        <option value="kombani">Kombani</option>
                        <option value="ukunda">Ukunda</option>
                        <option value="likoni">Likoni</option>
                      </select>
                    </span>
                  </div>
                  <div className="date">
                    <span>
                      <label htmlFor="date">Date</label>
                      <input type="date" name="date" id="date" required />
                    </span>
                    <span>
                      <label htmlFor="seats">No of seats</label>
                      <input
                        type="number"
                        name="seats"
                        id="seats"
                        placeholder="Eg. 1"
                        required
                      />
                    </span>
                  </div>
                  <div className="payment-choose">
                    <span>
                      <input
                        type="radio"
                        name="pay-now"
                        id="pay-now"
                        value="now"
                        checked={localPayTime === "now"}
                        onChange={handleLocalPayTime}
                      />
                      <label htmlFor="pay-now">Pay now</label>
                    </span>
                    <span>
                      <input
                        type="radio"
                        name="pay-later"
                        id="pay-later"
                        value="later"
                        checked={localPayTime === "later"}
                        onChange={handleLocalPayTime}
                      />
                      <label htmlFor="pay-later">Pay on pickup</label>
                    </span>
                  </div>
                </div>
                {localPayTime === "now" && (
                  <div className="stk">
                    <span>
                      <label htmlFor="mpesa-number">Mpesa number</label>
                      <input
                        type="number"
                        name="mpesa-number"
                        id="mpesa-number"
                        placeholder="Eg. 0712345678"
                        required
                      />
                    </span>
                    <button type="submit">Initialise</button>
                  </div>
                )}
                {localPayTime === "later" && (
                  <button id="book-now-btn" type="submit">
                    Book now
                  </button>
                )}
              </form>
            </div>
          )}
          {privateBookingModal && (
            <div className="booking-modal">
              <form className="booking-container">
                <div className="modal-top">
                  <p>Fill the following form</p>
                  <button onClick={handlePrivateBooking}>
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
                <div className="details-form">
                  <div className="names">
                    <span>
                      <label htmlFor="first-name">First name</label>
                      <input
                        type="text"
                        name="first-name"
                        id="first-name"
                        placeholder="Enter your first name"
                        required
                      />
                    </span>
                    <span>
                      <label htmlFor="last-name">Last name</label>
                      <input
                        type="text"
                        name="last-name"
                        id="last-name"
                        placeholder="Enter your last name"
                        required
                      />
                    </span>
                  </div>
                  <div className="place">
                    <span>
                      <label htmlFor="private-from">Starting point</label>
                      <input
                        type="text"
                        name="private-from"
                        id="private-from"
                        placeholder="Eg. Kwale"
                        required
                      />
                    </span>
                    <span>
                      <label htmlFor="private-to">Destination</label>
                      <select name="private-to" id="private-to" required>
                        <option value="airstrip">Ukunda airstrip</option>
                        <option value="airport">Moi Int airport</option>
                        <option value="sgr">Mombasa SGR station</option>
                      </select>
                    </span>
                  </div>
                  <div className="date">
                    <span>
                      <label htmlFor="date">Date</label>
                      <input type="date" name="date" id="date" required />
                    </span>
                    <span>
                      <label htmlFor="seats">No of seats</label>
                      <input
                        type="number"
                        name="seats"
                        id="seats"
                        placeholder="Eg. 1"
                        required
                      />
                    </span>
                  </div>
                  <span className="agree-span">
                    <input type="checkbox" name="agree" id="agree" required />
                    <label htmlFor="agree">
                      <Link to={"/private-booking/terms-and-conditions"}>
                        Agree to the terms and conditions
                      </Link>
                    </label>
                  </span>
                  <div className="stk">
                    <span>
                      <label htmlFor="mpesa-number">Mpesa number</label>
                      <input
                        type="number"
                        name="mpesa-number"
                        id="mpesa-number"
                        placeholder="Eg. 0712345678"
                        required
                      />
                    </span>
                    <button type="submit">Initialise</button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
        <div className="car-hire-booking">
          <h1>Rent a car</h1>
          <form className="search-form">
            <div className="hire-div">
              <span>
                <label htmlFor="car-type">Car type</label>
                <select name="car-type" id="car-type" required>
                  <option value="demio">Mazda demio</option>
                  <option value="vits">Vits</option>
                  <option value="sienta">Sienta</option>
                  <option value="noah">Noah</option>
                </select>
              </span>
              <span>
                <label htmlFor="days">Days</label>
                <select
                  name="days"
                  id="days"
                  value={days}
                  onChange={handleDays}
                  required
                >
                  <option value="one">One day</option>
                  <option value="more">More than a day</option>
                </select>
              </span>
              <div>
                {days === "one" && (
                  <span>
                    <label htmlFor="hire-date">Date</label>
                    <input
                      type="date"
                      name="hire-date"
                      id="hire-date"
                      required
                    />
                  </span>
                )}
                {days === "more" && (
                  <div className="more-days">
                    <span>
                      <label htmlFor="from-hire">From</label>
                      <input
                        type="date"
                        name="from-hire"
                        id="from-hire"
                        required
                      />
                    </span>
                    <span>
                      <label htmlFor="to-hire">To</label>
                      <input type="date" name="to-hire" id="to-hire" required />
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="form-buttons">
              <button type="submit">Search for cars</button>
              <button type="button" onClick={handleHire} id="book-button">
                Hire a car
              </button>
            </div>
          </form>
          {hireModal && (
            <div className="hire-modal">
              <form className="hire-container">
                <div className="modal-top">
                  <p>Fill the following form</p>
                  <button onClick={handleHire}>
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
                <div className="details-form">
                  <div className="names">
                    <span>
                      <label htmlFor="first-name">First name</label>
                      <input
                        type="text"
                        name="first-name"
                        id="first-name"
                        placeholder="Enter your first name"
                        required
                      />
                    </span>
                    <span>
                      <label htmlFor="last-name">Last name</label>
                      <input
                        type="text"
                        name="last-name"
                        id="last-name"
                        placeholder="Enter your last name"
                        required
                      />
                    </span>
                  </div>
                  <div className="place">
                    <span>
                      <label htmlFor="private-from">Starting point</label>
                      <input
                        type="text"
                        name="private-from"
                        id="private-from"
                        placeholder="Eg. Kwale"
                        required
                      />
                    </span>
                    <span>
                      <label htmlFor="private-to">Destination</label>
                      <select name="private-to" id="private-to" required>
                        <option value="airstrip">Ukunda airstrip</option>
                        <option value="airport">Moi Int airport</option>
                        <option value="sgr">Mombasa SGR station</option>
                      </select>
                    </span>
                  </div>
                  <div className="date">
                    <span>
                      <label htmlFor="car-type">Car type</label>
                      <select name="car-type" id="car-type" required>
                        <option value="demio">Mazda demio</option>
                        <option value="vits">Vits</option>
                        <option value="sienta">Sienta</option>
                        <option value="noah">Noah</option>
                      </select>
                    </span>
                    <span>
                      <label htmlFor="hire-date">Date</label>
                      <input type="date" name="hire-date" id="hire-date" />
                    </span>
                  </div>
                  <span className="agree-span">
                    <input type="checkbox" name="agree" id="agree" required />
                    <label htmlFor="agree">
                      <Link to={"/car-hire/terms-and-conditions"}>
                        Agree to the terms and conditions
                      </Link>
                    </label>
                  </span>
                  <div className="stk">
                    <span>
                      <label htmlFor="mpesa-number">Mpesa number</label>
                      <input
                        type="number"
                        name="mpesa-number"
                        id="mpesa-number"
                        placeholder="Eg. 0712345678"
                        required
                      />
                    </span>
                    <button type="submit">Initialise</button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Booking;
