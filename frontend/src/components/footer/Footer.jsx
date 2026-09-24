import React from "react";
import "./footer.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <>
      <footer>
        <div className="footer-top">
          <p id="comp-name">&copy; Mobilix. All rights reserved.</p>
          <p id="notion">Seamless rides, smart bookings</p>
          <p id="entails">Drive, book, go</p>
          <form className="subscribe" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              name="subscribe"
              id="subscribe"
              placeholder="your@email.com"
            />
            <button>Subscribe</button>
          </form>
        </div>
        <div className="footer-bottom">
          <div className="footer-bottom-one">
            <span>
              <h3>Contact</h3>
              <Link to={"mailto:rajaxraj1997@gmail.com"} target="_blank">
                Email us
              </Link>
              <Link to={"tel:+254704679648"} target="_blank">
                Call us
              </Link>
              <Link to={"https://wa.link/2exqq4"}>Whatsapp</Link>
            </span>
            <span>
              <h3>Quick links</h3>
              <Link to={"/"}>Home</Link>
              <Link to={"/about"}>About</Link>
              <Link to={"/services"}>Services</Link>
              <Link to={"/contact"}>Contact</Link>
            </span>
            <span>
              <h3>Support</h3>
              <Link to={"/tickets"}>Print ticket</Link>
              <Link to={"/booking"}>Booking</Link>
              <Link>Admin portal</Link>
            </span>
          </div>
          <div className="footer-bottom-two">
            <span id="made">
              <p>Made by Finora technologies. {new Date().getFullYear()}</p>
              <p>
                <i className="fa-solid fa-location-dot"></i> Kwale, Kenya
              </p>
            </span>
            <span id="footer-handles">
              <Link to={"https://wa.link/2exqq4"} target="_blank">
                <i className="fa-brands fa-whatsapp"></i>
              </Link>
              <Link to={"mailto:rajaxraj1997@gmail.com"} target="_blank">
                <i className="fa-solid fa-envelope"></i>
              </Link>
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
