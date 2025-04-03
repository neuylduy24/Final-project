import React, { useEffect, useState } from "react";
import { FaEye, FaStar, FaRegStar } from "react-icons/fa6";
import { FaUser, FaBookOpen } from "react-icons/fa";
import ButtonFollow from "component/Action/ButtonFollow/buttonFollow";
import chapterService from "service/chapterService";
import "./bookinfor.scss";

const BookInfo = ({ book }) => {
  const [totalViews, setTotalViews] = useState(book.views || 0);

  useEffect(() => {
    if (!book.views) {
      chapterService
        .getTotalViewsByBookId(book.id)
        .then((total) => setTotalViews(total))
        .catch((error) => console.error("Error fetching total views:", error));
    }
  }, [book.id, book.views]);

  return (
    <div className="book-info">
      <h2 className="book-title">{book.title}</h2>
      <p className="book-description">
        {book.description || "Not yet description"}
      </p>

      <div className="book-meta">
        <p>
          <FaUser /> <b>Author:</b> <span>{book.author}</span>
        </p>
        <p>
          <FaBookOpen /> <b>Status:</b> <span>{book.status || "Updating"}</span>
        </p>
        <p>
          <FaEye /> <b>View:</b> <span>{totalViews}</span>
        </p>
        <p>
          <FaStar /> <b>Rating:</b>{" "}
          <span>{book.rating ? book.rating.toFixed(1) : "0.0"}/5</span>
        </p>
      </div>

      <div className="book-tags">
        {book.categories?.length ? (
          book.categories.map((tag, index) => (
            <span key={index}>{tag.name}</span>
          ))
        ) : (
          <span className="no-tags">No Categories</span>
        )}
      </div>

      <div className="book-rating">
        {[...Array(5)].map((_, i) =>
          i < book.rating ? <FaStar key={i} /> : <FaRegStar key={i} />
        )}
      </div>
      <ButtonFollow bookId={book.id} />
    </div>
  );
};

export default BookInfo;
