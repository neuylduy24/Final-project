import React from "react";
import parseISO from "date-fns/parseISO";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { vi } from "date-fns/locale";
import "./bookDetailCard.scss";
import { useNavigate } from "react-router-dom";
import { ROUTERS } from "utils/path";

const BookCard = ({ book }) => {
  const navigate = useNavigate();

  // Kiểm tra nếu book không tồn tại
  if (!book) {
    console.error("Book data is missing.");
    return null;
  }

  // Lấy bookId an toàn
  const bookId = book?.bookId || book?.id;
  if (!bookId) {
    console.error("Book ID is missing for the book:", book);
    return null;
  }

  return (
    <div
      className="col-lg-2 col-md-4 col-sm-6 col-xs-12"
      key={bookId}
      onClick={() =>
        navigate(`${ROUTERS.USER.BOOKDETAIL.replace(":id", bookId)}`)
      }
      style={{ cursor: "pointer" }}
    >
      <div className="book-card">
        <div
          className="book-img"
          style={{ backgroundImage: `url(${book?.image})` }}
        >
          {book?.rating >= 4 && <span className="badge-hot">Hot</span>}
        </div>
        <div className="book-info">
          <h4>{book?.title || "Không có tiêu đề"}</h4>
          <p>
            {book?.chapters?.length > 0
              ? `Chapter ${book.chapters.length}`
              : "Chưa có chương"}
          </p>
          <span className="rating">⭐ {book?.rating || "Chưa có đánh giá"}</span>
        </div>
      </div>
    </div>
  );
};


export default BookCard;
