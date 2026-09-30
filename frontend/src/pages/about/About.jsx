import React from "react";
import "./about.css";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Connect from "../../components/connect/Connect";

function About() {
  return (
    <>
      <Header />
      <div className="about">
        <div className="about-top">
          <h1>ABOUT US</h1>
          <h2>Built in Kwale - Kenya</h2>
          <p>
            Mobilix is an established transport service provider company
            dedicated to give you reliable transport services at your comfort.
            We offer car hire services, local transit, private transport
            services and luggage carrier services.
          </p>
        </div>
        <div className="about-bottom">
          <h1>OUR JOURNEY</h1>
          <h2>Get to know us</h2>
          <div className="about-bottom-cont">
            <div className="bottom-cont-left">
              <p>
                Mobilix began in 2024, not as an established organisation, but
                with the aim of prividing reliable transport services around
                Kwale county.
              </p>
              <p>
                From 2024, we have been offering short distance travels along
                the kwale routes. Later in 2025, we upgraded to provding private
                transport services hence letting people experience the ultimate
                comfort on their own schedules.
              </p>
              <p>
                On 2025, we advanced to providing car rental services where we
                offerd comfortable, well-maintained vehicles for self-drives and
                safe cargo handling where we ensured that luggages were
                transported at their destination safely and right on time.
              </p>
            </div>
            <div className="bottom-cont-right">
              <span id="years">
                <h2>3+</h2>
                <p>Years of working</p>
              </span>
            </div>
          </div>
        </div>
        <div className="values">
          <h1>OUR VALUES</h1>
          <h2>What fuels our passion</h2>
          <div className="values-cont">
            <span>
              <span class="material-symbols-outlined" id="value-icon">
                departure_board
              </span>
              <h3>Reliability</h3>
              <p>Consintently showing up on time</p>
            </span>
            <span>
              <span class="material-symbols-outlined" id="value-icon">
                volunteer_activism
              </span>
              <h3>Transaparency</h3>
              <p>Operating with complete honesty</p>
            </span>
            <span>
              <span class="material-symbols-outlined" id="value-icon">
                workspace_premium
              </span>
              <h3>Professionalism</h3>
              <p>Delivering every service with high standards of respect</p>
            </span>
            <span>
              <span class="material-symbols-outlined" id="value-icon">
                shield_with_heart
              </span>
              <h3>Safety first</h3>
              <p>
                Prioritising the physical well-being of passengers and security
              </p>
            </span>
          </div>
        </div>
      </div>
      <Connect />
      <Footer />
    </>
  );
}

export default About;
