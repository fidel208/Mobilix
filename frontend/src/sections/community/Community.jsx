import React, { useState } from "react";
import "./community.css";

function Community() {
  const [communityModal, setCommunityModal] = useState(false);
  const handleCommunity = () => {
    if (communityModal === false) {
      setCommunityModal(true);
    } else {
      setCommunityModal(false);
    }
  };

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
            <button type="button" onClick={handleCommunity}>
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
                  <th>Date joined</th>
                  <th>Modify</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>dempafidel@gmail.com</td>
                  <td>subscribed</td>
                  <td>Tuesday 8:20am</td>
                  <td>
                    <button id="delete-btn">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>fidempa03@gmail.com</td>
                  <td>subscribed</td>
                  <td>Tuesday 8:20am</td>
                  <td>
                    <button id="delete-btn">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>fidelmuthomi007@gmail.com</td>
                  <td>subscribed</td>
                  <td>Tuesday 8:20am</td>
                  <td>
                    <button id="delete-btn">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </td>
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
      {communityModal && (
        <div className="community-overlay">
          <div className="community-modal">
            <div className="modal-top">
              <p>Add a client</p>
              <button onClick={handleCommunity}>
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
            <form>
              <span>
                <label htmlFor="client-email">Email address</label>
                <input type="email" name="client-email" id="client-email" />
              </span>
              <span>
                <label htmlFor="status">Status</label>
                <select name="status" id="status">
                  <option value="subscribed">Subscribed</option>
                  <option value="not-subscribed">Not subscribed</option>
                </select>
                <button>Submit</button>
              </span>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Community;
