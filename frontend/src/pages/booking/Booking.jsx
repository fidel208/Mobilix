import React, { useState } from "react";
import "./booking.css";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

function Booking() {
  const [type, setType] = useState("local");
  const [days, setDays] = useState("one");

  const handleType = (e) => {
    setType(e.target.value);
  };

  const handleDays = (e) => {
    setDays(e.target.value);
  };

  const [bookingModal, setBookingModal] = useState(false);
  const handleBooking = () => {
    if (bookingModal === false) {
      setBookingModal(true);
    } else {
      setBookingModal(false);
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
          <form>
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
              <div className="local-div">
                <p>5 seats left</p>
                <div className="inputs">
                  <span>
                    <label htmlFor="local-from">Starting point</label>
                    <select name="local-to" id="local-to">
                      <option value="kwale">Kwale town</option>
                      <option value="kombani">Kombani</option>
                      <option value="ukunda">Ukunda</option>
                      <option value="likoni">Likoni</option>
                    </select>
                  </span>
                  <span>
                    <label htmlFor="local-to">Destination</label>
                    <select name="local-to" id="local-to">
                      <option value="kwale">Kwale town</option>
                      <option value="kombani">Kombani</option>
                      <option value="ukunda">Ukunda</option>
                      <option value="likoni">Likoni</option>
                    </select>
                  </span>
                  <span>
                    <label htmlFor="local-date">Date</label>
                    <input type="date" name="local-date" id="local-date" />
                  </span>
                </div>
              </div>
            )}
            {type === "private" && (
              <div className="private-div">
                <p>2 cars left</p>
                <div className="inputs">
                  <span>
                    <label htmlFor="private-from">Starting point</label>
                    <input type="text" name="private-from" id="private-from" />
                  </span>
                  <span>
                    <label htmlFor="private-to">Destination</label>
                    <select name="private-to" id="private-to">
                      <option value="airstrip">Ukunda airstrip</option>
                      <option value="airport">Moi Int airport</option>
                      <option value="sgr">Mombasa SGR station</option>
                    </select>
                  </span>
                </div>
              </div>
            )}
            {type === "luggage" && (
              <div className="luggage-div">
                <p>3 cars available</p>
                <div className="inputs">
                  <span>
                    <label htmlFor="luggage-from">Starting point</label>
                    <select name="luggage-from" id="luggage-from">
                      <option value="kwale">Kwale town</option>
                      <option value="kombani">Kombani</option>
                      <option value="ukunda">Ukunda</option>
                      <option value="likoni">Likoni</option>
                    </select>
                  </span>
                  <span>
                    <label htmlFor="luggage-to">Destination</label>
                    <select name="luggage-to" id="luggage-to">
                      <option value="kwale">Kwale town</option>
                      <option value="kombani">Kombani</option>
                      <option value="ukunda">Ukunda</option>
                      <option value="likoni">Likoni</option>
                    </select>
                  </span>
                  <span>
                    <label htmlFor="luggage-date">Date</label>
                    <input type="date" name="luggage-date" id="luggage-date" />
                  </span>
                </div>
              </div>
            )}
            <button type="button" onClick={handleBooking}>
              {bookingModal && (
                <div className="booking-modal" onClick={handleBooking}>
                  <div className="booking-container"></div>
                </div>
              )}
              Get a ticket
            </button>
          </form>
        </div>
        <div className="car-hire-booking">
          <h1>Rent a car</h1>
          <form>
            <div className="hire-div">
              <span>
                <label htmlFor="car-type">Car type</label>
                <select name="car-type" id="car-type">
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
                >
                  <option value="one">One day</option>
                  <option value="more">More than a day</option>
                </select>
              </span>
              <div>
                {days === "one" && (
                  <span>
                    <label htmlFor="hire-date">Date</label>
                    <input type="date" name="hire-date" id="hire-date" />
                  </span>
                )}
                {days === "more" && (
                  <div className="more-days">
                    <span>
                      <label htmlFor="from-hire">From</label>
                      <input type="date" name="from-hire" id="from-hire" />
                    </span>
                    <span>
                      <label htmlFor="to-hire">To</label>
                      <input type="date" name="to-hire" id="to-hire" />
                    </span>
                  </div>
                )}
              </div>
            </div>
            <button type="button" onClick={handleHire}>
              Hire a car
            </button>
            {hireModal && (
              <div className="hire-modal" onClick={handleHire}>
                <div className="hire-container"></div>
              </div>
            )}
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Booking;
