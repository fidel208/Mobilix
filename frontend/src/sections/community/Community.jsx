import React, { useState } from "react";
import "./community.css";

function Community() {
  const [community, setCommunity] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const lastRowIndex = currentPage * rowsPerPage;
  const firstRowIndex = lastRowIndex - rowsPerPage;

  const currentRows = community.slice(firstRowIndex, lastRowIndex);
  const totalPages = Math.ceil(community.length / rowsPerPage) || 1;

  return (
    <>
      <div className="community">
        <div className="community-container">
          <h1>Community</h1>
          <div className="search-div">
            <span id="search-input">
              <span className="material-symbols-outlined">search</span>
              <input type="search" placeholder="Search for a client"></input>
            </span>
            <button type="button">
              <span className="material-symbols-outlined">add</span>Add a new
              client
            </button>
          </div>
          <div className="community-table-cont">
            <table className="community-table">
              <thead>
                <tr>
                  <th>Email address</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>dempafidel@gmail.com</td>
                  <td>subscribed</td>
                </tr>
                <tr>
                  <td>fidempa03@gmail.com</td>
                  <td>subscribed</td>
                </tr>
                <tr>
                  <td>fidelmuthomi007@gmail.com</td>
                  <td>subscribed</td>
                </tr>
              </tbody>
            </table>
            <div className="pagination-controls">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="page-btn"
              >
                <i className="fa-solid fa-angle-left"></i> Previous
              </button>
              <span className="page-number">
                Page <b>{currentPage}</b> of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="page-btn"
              >
                Next <i className="fa-solid fa-angle-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Community;
