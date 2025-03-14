import React from "react";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import "./pagination.scss";

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
  return (
    <div className="footer">
    <div className="pagination">
      <button className="page-button" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
        <FaArrowLeftLong />
      </button>
      {Array.from({ length: totalPages }, (_, index) => (
        <button key={index + 1} className={`page-button ${currentPage === index + 1 ? "page-button-active" : ""}`} onClick={() => setCurrentPage(index + 1)}>
          {index + 1}
        </button>
      ))}
      <button className="page-button" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
        <FaArrowRightLong />
      </button>
    </div>
    </div>
  );
};

export default Pagination;
