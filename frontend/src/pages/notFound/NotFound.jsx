import React from "react";
import "./notFound.css";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <>
      <div className="not-found">
        <p>Error 404, not found</p>
        <Link to={"/"}>
          <button>Go home</button>
        </Link>
      </div>
    </>
  );
}

export default NotFound;
