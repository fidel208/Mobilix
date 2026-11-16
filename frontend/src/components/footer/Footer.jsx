import React, { useState } from "react";
import "./footer.css";
import { Link } from "react-router-dom";
import API from "../../services/api";

function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!email || !email.includes("@")) {
      setIsSuccess(false);
      setMessage("Please provide a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/community", {
        email: email.trim().toLowerCase(),
        status: "subscribed",
      });

      setIsSuccess(true);
      setMessage(
        response.data?.message || "Successfully subscribed to our community!",
      );
      setEmail("");
      window.location.reload();
    } catch (err) {
      setIsSuccess(false);
      setMessage(
        err.response?.data?.message || "Failed to subscribe. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <footer>
        <div className="footer-top">
          <p id="comp-name">&copy; Mobilix. All rights reserved.</p>
          <p id="notion">Seamless rides, smart bookings</p>
          <p id="entails">Book, drive, go</p>
          <form className="subscribe" onSubmit={handleSubscribe}>
            <input
              type="email"
              name="subscribe"
              id="subscribe"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (message) setMessage("");
              }}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Subscribe"}
            </button>
          </form>
          {message && (
            <p
              style={{
                fontSize: "14px",
                margin: "4px 0 0 0",
                color: isSuccess ? "#86efac" : "#fca5a5",
                fontWeight: 500,
              }}
            >
              {message}
            </p>
          )}
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
            </span>
          </div>
          <div className="footer-bottom-two">
            <span id="made">
              <p>Made by Radah softwares. {new Date().getFullYear()}</p>
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
