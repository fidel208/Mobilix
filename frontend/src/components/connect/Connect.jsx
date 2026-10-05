import React from "react";
import "./connect.css";
import { Link } from "react-router-dom";

function Connect() {
  return (
    <>
      <section className="connect-section">
        <div className="connect">
          <h1>Book, drive, go</h1>
          <p>Enjoy the best transport services at your comfort</p>
          <Link to={"/booking"}>
            <button>Book us now</button>
          </Link>
        </div>
      </section>
    </>
  );
}

export default Connect;
