import React from "react";
import parseISO from 'date-fns/parseISO';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { vi } from "date-fns/locale";
import "./bookDetailCard.scss";
import { useNavigate } from "react-router-dom";
import { ROUTERS } from "utils/path";

const BookCard = ({ book, onClick }) => {
  const navigate = useNavigate();

  let lastUpdated = "Not available";

  if (book.updatedAt) {
    try {
      const parsedDate = parseISO(book.updatedAt);
      if (!isNaN(parsedDate.getTime())) {
        lastUpdated = formatDistanceToNow(parsedDate, {
          addSuffix: true,
          locale: vi,
        });
      }
    } catch (error) {
      console.error("Lỗi parse updatedAt:", error);
    }
  }

  return (
    <div
      className="col-lg-2 col-md-4 col-sm-6 col-xs-12"
      key={book.id}
      onClick={() =>
        navigate(`${ROUTERS.USER.BOOKDETAIL.replace(":id", book.bookId || book.id)}`)
      }
      
      style={{ cursor: "pointer" }}
    >
      <div className="book-card">
        <div
          className="book-img"
          style={{ backgroundImage: `url(${book.image})` }}
        >
          <span className="badge-time">{lastUpdated}</span>
          {book.rating >= 4 && <span className="badge-hot">Hot</span>}
        </div>
        <div className="book-info">
          <h4>{book.title}</h4>
          <p>
            {book.chapters?.length > 0
              ? `Chapter ${book.chapters.length}`
              : "Not yet chapter"}
          </p>
          <span className="rating">⭐ {book.rating || "Not yet rating"}</span>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
