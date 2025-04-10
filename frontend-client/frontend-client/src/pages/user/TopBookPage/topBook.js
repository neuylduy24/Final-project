import React, { useEffect, useState } from "react";
import BookRankingApi from "../../../api/BookRankingApi";
import BookCard from "../../../component/Book/Card/bookDetailCard";
import "./topBooks.scss";
import bookService from "service/bookService";

const BookHotPage = ({ books: booksFromProps }) => {
  const [books, setBooks] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        let data = [];
        switch (activeFilter) {
          case "all":
            data = await bookService.getAllBooks();
            break;
          case "topViewToday":
            data = await BookRankingApi.getTop10BooksByViews();
            break;
          case "topFollowThisWeek":
            data = await BookRankingApi.getAllBooksByFollow();
            break;
          case "topFollowAllTime":
            data = await BookRankingApi.getTop10BooksByFollow();
            break;
          case "newestBooks":
            data = await BookRankingApi.getBooksSortedByCreatedDateDesc();
            break;
          case "recommendation":
          default:
            data = booksFromProps || [];
            break;
        }
        setBooks(data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu sách:", error);
      } finally {
        setLoading(false);
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
          className={activeFilter === "recommendation" ? "active" : ""}
          onClick={() => setActiveFilter("recommendation")}
        >
          Recommendation
        </button>
        <button
          className={activeFilter === "topViewToday" ? "active" : ""}
          onClick={() => setActiveFilter("topViewToday")}
        >
          Top View Today
        </button>
        <button
          className={activeFilter === "topFollowThisWeek" ? "active" : ""}
          onClick={() => setActiveFilter("topFollowThisWeek")}
        >
          Top Follow This Week
        </button>
        <button
          className={activeFilter === "newestBooks" ? "active" : ""}
          onClick={() => setActiveFilter("newestBooks")}
        >
          Top Book New
        </button>
      </div>

      <div className="book-grid">
        {loading ? (
          <p>Loading...</p>
        ) : (
          books.map((book) => <BookCard key={book.id} book={book} />)
        )}
      </div>
    </div>
  );
};

export default BookHotPage;
