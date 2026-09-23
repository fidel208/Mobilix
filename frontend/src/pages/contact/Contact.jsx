import React from "react";
import "./contact.css";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

function Contact() {
  return (
    <>
      <Header />
      <div className="contact">
        <div className="support">
          <div className="support-top">
            <img src="support.svg" alt="support-image" />
            <p>We provide 24/7 customer support services</p>
          </div>
          <div className="support-bottom">
            <span>
              <i className="fa-solid fa-phone"></i>
              <h2>Call us</h2>
              <p>+254115931207</p>
            </span>
            <span>
              <i className="fa-brands fa-whatsapp"></i>
              <h2>Whatsapp</h2>
              <p>+254789455874</p>
            </span>
            <span>
              <i className="fa-solid fa-envelope"></i>
              <h2>Email us</h2>
              <p>info@mobilix.co.ke</p>
            </span>
          </div>
        </div>
        <div className="contact-us">
          <div className="contact-details">
            <h3>Contact details</h3>
            <hr />
            <span className="office-details">
              <h4>Head office</h4>
              <p>info@mobilix.co.ke</p>
              <p>+254789455874</p>
              <p>
                <i className="fa-solid fa-location-dot"></i> Ukunda, Kwale -
                Kenya
              </p>
            </span>
          </div>
          <form className="send-message">
            <div id="form-div">
              <span id="form-span">
                <label htmlFor="first-name">First name</label>
                <input type="text" id="first-name" name="first-name" />
              </span>
              <span id="form-span">
                <label htmlFor="last-name">Last name</label>
                <input type="text" id="last-name" name="last-name" />
              </span>
            </div>
            <div id="form-div">
              <span id="form-span">
                <label htmlFor="email">Email address</label>
                <input type="email" id="email" name="email" />
              </span>
              <span id="form-span">
                <label htmlFor="phone">Phone number</label>
                <input type="tel" id="phone" name="phone" />
              </span>
            </div>
            <span id="form-span">
              <label htmlFor="message">Message</label>
              <textarea name="message" id="message"></textarea>
            </span>
            <button>Send message</button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Contact;
