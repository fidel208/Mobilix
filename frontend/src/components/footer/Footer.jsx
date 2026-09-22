import React from "react";
import "./footer.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <>
      <footer>
        <div className="footer-top">
          <p>&copy; Mobilix. All rights reserved. {new Date().getFullYear()}</p>
          <p>Seamless rides, smart bookings</p>
          <p>Drive, book, go</p>
          <span className="subscribe">
            <input
              type="text"
              name="subscribe"
              id="subscribe"
              placeholder="your@email.com"
            />
            <button>Subscribe</button>
          </span>
        </div>
        <div className="footer-bottom">
          <div className="footer-bottom-one">
            <span>
              <h3>Contact</h3>
              <Link>Email us</Link>
              <Link>Call us</Link>
              <Link>Whatsapp</Link>
            </span>
            <span>
              <h3>Quick links</h3>
              <Link to={"/"}>Home</Link>
              <Link to={"/about"}>About</Link>
              <Link to={"/services"}>Services</Link>
            </span>
            <span>
              <h3>Support</h3>
              <Link to={"/tickets"}>Print ticket</Link>
              <Link to={"/booking"}>Booking</Link>
              <Link to={"/contact"}>Contact</Link>
            </span>
          </div>
          <div className="footer-bottom-two"></div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
