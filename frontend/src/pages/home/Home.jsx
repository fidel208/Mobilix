import React from "react";
import "./home.css";
import { Link } from "react-router-dom";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Connect from "../../components/connect/Connect";

function Home() {
  return (
    <>
      <Header />
      <div className="home"></div>
      <div className="home-service">
        <h1>SERVICES</h1>
        <p>What we provide</p>
        <div className="home-service-cont">
          <span className="service-container">
            <span className="material-symbols-outlined">local_taxi</span>
            <h2>Local transit</h2>
            <p>
              We provide short distance travels that gives you quick comfortable
              and dependable rides for your everyday errands.
            </p>
            <Link>
              Learn more
              <span className="material-symbols-outlined">arrow_right_alt</span>
            </Link>
          </span>
          <span className="service-container">
            <span className="material-symbols-outlined">directions_car</span>
            <h2>Private transports</h2>
            <p>
              We let you experience the utimate comfort with our private
              transport service.
            </p>
            <Link>
              Learn more
              <span className="material-symbols-outlined">arrow_right_alt</span>
            </Link>
          </span>
          <span className="service-container">
            <span className="material-symbols-outlined">local_shipping</span>
            <h2>Carrier services</h2>
            <p>
              Our dedicated luggage transport service ensures your
              belongingsreach at your destination safely, securely and right on
              time.
            </p>
            <Link>
              Learn more
              <span className="material-symbols-outlined">arrow_right_alt</span>
            </Link>
          </span>
          <span className="service-container">
            <span className="material-symbols-outlined">car_rental</span>
            <h2>Reliable car hire</h2>
            <p>
              We offer well-maintained, comfortable and fuel-efficient vehicles
              available for both self-drives ad chauffered options.
            </p>
            <Link>
              Learn more
              <span className="material-symbols-outlined">arrow_right_alt</span>
            </Link>
          </span>
        </div>
      </div>
      <div className="home-routes">
        <h1>OUR ROUTES</h1>
        <ul>
          <li>Kwale town-Kombani</li>
          <li>Kwale town - Ukunda</li>
          <li>Kwale town - Likoni</li>
          <li>Kombani - Ukunda</li>
          <li>Likoni - Kombani</li>
          <li>Anywhere - SGR MSA station</li>
          <li>Anywhere - Ukunda airstrip</li>
          <li>Anywhere - Moi Int airport</li>
        </ul>
      </div>
      <Connect />
      <Footer />
    </>
  );
}

export default Home;
