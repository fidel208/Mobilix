import React from "react";
import { Link } from "react-router-dom";
import "./services.css";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Connect from "../../components/connect/Connect";

function Services() {
  return (
    <>
      <Header />
      <div className="services" id="services">
        <div className="services-top">
          <h1>OUR SERVICES</h1>
          <h2>
            Discover our reliable transport solutions to keep you, your schedule
            and your belongings moving smoothly.
          </h2>
        </div>
        <div className="services-bottom">
          <div className="service-cont">
            <span id="description">
              <h2>Local transit</h2>
              <p>
                We provide short distance travels that gives you quick
                comfortable and dependable rides for your everyday errands.
                Enjoy timely pickups, expert local driers who give youa smooth
                journey experience that gets you to your destination on time.
              </p>
              <span id="routes">
                <h3>Routes</h3>
                <ul>
                  <li>Kwale town - Kombani</li>
                  <li>Kwale town - Ukunda</li>
                  <li>Kwale town - Likoni</li>
                  <li>Kombani - Ukunda</li>
                  <li>Likoni - Kombani</li>
                </ul>
              </span>
              <Link>
                Book now
                <span className="material-symbols-outlined">
                  arrow_right_alt
                </span>
              </Link>
            </span>
            <img src="tuktuk.jpeg" alt="local-transit" loading="lazy" />
          </div>
          <div className="service-cont">
            <img src="cx-5.webp" alt="private-booking" loading="lazy" />
            <span id="description">
              <h2>Private transport and personal bookings</h2>
              <p>
                We let you experience the utimate comfort with our private
                transport service. Travel on our own schedule with complete
                peace knowing every detail is customized to your preference.
              </p>
              <span id="routes">
                <h3>Routes</h3>
                <ul>
                  <li>Anywhere - Ukunda airstrip</li>
                  <li>Anywhere - Moi International airport</li>
                  <li>Anywhere - Mombasa SGR station</li>
                </ul>
              </span>
              <Link>
                Book now
                <span className="material-symbols-outlined">
                  arrow_right_alt
                </span>
              </Link>
            </span>
          </div>
          <div className="service-cont">
            <span id="description">
              <h2>Carrier services</h2>
              <p>
                Our dedicated luggage transport service ensures your
                belongingsreach at your destination safely, securely and right
                on time. We handle your cargo with care so that you can travel
                light and worry-free.
              </p>
              <span id="routes">
                <h3>Routes</h3>
                <ul>
                  <li>Anywhere across Kwale County</li>
                </ul>
              </span>
              <Link>
                Book now
                <span className="material-symbols-outlined">
                  arrow_right_alt
                </span>
              </Link>
            </span>
            <img src="truck.jpeg" alt="carrier-services" loading="lazy" />
          </div>
          <div className="service-cont">
            <img src="mazda-demio.png" alt="car-rental" loading="lazy" />
            <span id="description">
              <h2>Reliable car hire</h2>
              <p>
                We offer well-maintained, comfortable and fuel-efficient
                vehicles available for both self-drives ad chauffered options.
                With transaparent pricing and flexible rates, we put you in the
                driver's seat of convinience.
              </p>
              <span id="routes">
                <h3>Routes</h3>
                <ul>
                  <li>Anywhere across Kwale County</li>
                </ul>
              </span>
              <Link>
                Book now
                <span className="material-symbols-outlined">
                  arrow_right_alt
                </span>
              </Link>
            </span>
          </div>
        </div>
      </div>
      <Connect />
      <Footer />
    </>
  );
}

export default Services;
