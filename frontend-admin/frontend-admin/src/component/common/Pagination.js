import React from 'react';

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
  const pageNumbers = [...Array(totalPages).keys()].map(i => i + 1);
  
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Hiển thị tối đa 5 nút trang
  const getVisiblePageNumbers = () => {
    let startPage, endPage;
    if (totalPages <= 5) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= 3) {
        startPage = 1;
        endPage = 5;
      } else if (currentPage + 2 >= totalPages) {
        startPage = totalPages - 4;
        endPage = totalPages;
      } else {
        startPage = currentPage - 2;
        endPage = currentPage + 2;
      }
    }
    return pageNumbers.slice(startPage - 1, endPage);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button 
        onClick={goToPrevPage} 
        disabled={currentPage === 1}
      >
        &laquo; Trước
      </button>
      
      {getVisiblePageNumbers().map(number => (
        <button
          key={number}
          onClick={() => goToPage(number)}
          className={currentPage === number ? 'active' : ''}
        >
          {number}
        </button>
      ))}
      
      <button 
        onClick={goToNextPage} 
        disabled={currentPage === totalPages}
      >
        Sau &raquo;
      </button>
    </div>
  );
};

export default Pagination;
