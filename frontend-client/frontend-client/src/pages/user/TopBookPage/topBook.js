import React, { useEffect, useState } from "react";
import BookRankingApi from "../../../api/BookRankingApi";
import BookCard from "../../../component/Book/Card/bookDetailCard";
import "./topBooks.scss";
import bookService from "service/bookService";

const BookHotPage = ({ books: booksFromProps }) => {

  const [books, setBooks] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        let data = [];
        switch (activeFilter) {
          case "day":
            data = await BookRankingApi.getTop10BooksByViews();
            break;
          case "week":
            data = await BookRankingApi.getAllBooksByFollow();
            break;
          case "topFollow":
            data = await BookRankingApi.getTop10BooksByFollow();
            break;
          case "views":
            data = await BookRankingApi.getBooksSortedByCreatedDateDesc();
            break;
          case "all":
          default:
            data = booksFromProps || [];
            break;
        }
        setBooks(data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu sách:", error);
      }
    };
  
    fetchBooks();
  }, [activeFilter, booksFromProps]);
  

  return (
    <div className="book-hot-page">
      <div className="filter-buttons">
        <button
          className={activeFilter === "all" ? "active" : ""}
          onClick={() => setActiveFilter("all")}
        >
          All
        </button>
        <button
          className={activeFilter === "day" ? "active" : ""}
          onClick={() => setActiveFilter("day")}
        >
          Top View
        </button>
        <button
          className={activeFilter === "week" ? "active" : ""}
          onClick={() => setActiveFilter("week")}
        >
          Top Follow
        </button>
        <button
          className={activeFilter === "views" ? "active" : ""}
          onClick={() => setActiveFilter("views")}
        >
          Top Book New
        </button>
      </div>

      <div className="book-grid">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default BookHotPage;
