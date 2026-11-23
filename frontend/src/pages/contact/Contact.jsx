import { useState } from "react";
import "./contact.css";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import API from "../../services/api";

function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!formData.firstName.trim()) {
      setErrorMsg("Please enter your first name.");
      return;
    }

    if (!formData.email.trim() || !formData.email.includes("@")) {
      setErrorMsg("Please provide a valid email address.");
      return;
    }

    if (!formData.message.trim()) {
      setErrorMsg("Please enter your message.");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/contact", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      });

      setSuccessMsg(
        response.data?.message ||
          "Your message has been sent to info@mobilix.co.ke. We will get back to you shortly.",
      );
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message ||
          "Failed to send your message. Please try again or contact us directly.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="contact">
        <div className="support">
          <div className="support-top">
            <img src="support.svg" alt="support-image" loading="lazy" />
            <p>We provide 24/7 customer support services</p>
          </div>
          <div className="support-bottom">
            <span>
              <i className="fa-solid fa-phone"></i>
              <h2>Call us</h2>
              <p>+254718176860</p>
            </span>
            <span>
              <i className="fa-brands fa-whatsapp"></i>
              <h2>Whatsapp</h2>
              <p>+254734741509</p>
            </span>
            <span>
              <i className="fa-solid fa-envelope"></i>
              <h2>Email us</h2>
              <p>support@mobilix.co.ke</p>
            </span>
            <span>
              <i className="fa-solid fa-hourglass-start"></i>
              <h2>Availablity</h2>
              <p>24/7 including weekends</p>
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
              <p>+254704679648</p>
              <p>
                <i className="fa-solid fa-location-dot"></i> Ukunda, Kwale -
                Kenya
              </p>
            </span>
          </div>
          <form className="send-message" onSubmit={handleSubmit}>
            {successMsg && (
              <div
                style={{
                  background: "#dcfce7",
                  color: "#15803d",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "16px",
                }}
              >
                {successMsg}
              </div>
            )}
            {errorMsg && (
              <div
                style={{
                  background: "#fee2e2",
                  color: "#b91c1c",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "16px",
                }}
              >
                {errorMsg}
              </div>
            )}
            <div id="form-div">
              <span id="form-span">
                <label htmlFor="first-name">First name</label>
                <input
                  type="text"
                  id="first-name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  required
                />
              </span>
              <span id="form-span">
                <label htmlFor="last-name">Last name</label>
                <input
                  type="text"
                  id="last-name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                />
              </span>
            </div>
            <div id="form-div">
              <span id="form-span">
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                />
              </span>
              <span id="form-span">
                <label htmlFor="phone">Phone number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="eg. +254712345678"
                />
              </span>
            </div>
            <span id="form-span">
              <label htmlFor="message">Message</label>
              <textarea
                name="message"
                id="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Enter your message"
                rows={5}
                required
              ></textarea>
            </span>
            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send message"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Contact;
