import React from "react";
import "./home.css";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Connect from "../../components/connect/Connect";

function Home() {
  return (
    <>
      <Header />
      <div className="home"></div>
      <Connect />
      <Footer />
    </>
  );
}

export default Home;
