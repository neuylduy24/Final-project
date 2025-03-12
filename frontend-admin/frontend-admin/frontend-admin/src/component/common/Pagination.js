import React from "react";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import "./pagination.scss";

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
  if (totalPages <= 1) return null;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  return (
    <div className="footer">
    <div className="pagination">
      <button className="page-button"  onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
        <FaArrowLeftLong/>
      </button>
      <span>Trang {currentPage} / {totalPages}</span>
      <button className="page-button" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        <FaArrowRightLong/>
      </button>
    </div>
    </div>
  );
};

export default Pagination;
