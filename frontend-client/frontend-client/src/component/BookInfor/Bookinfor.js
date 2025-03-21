import React from "react";
import { FaEye, FaStar, FaRegStar } from "react-icons/fa6";
import { FaUser, FaBookOpen } from "react-icons/fa";
import Quantity from "component/Quantity/quantity";
import "./bookinfor.scss";

const BookInfo = ({ book }) => {
  return (
    <div className="col-lg-9 col-lg-6 book-info">
      <h2 className="book-title">{book.title}</h2>
      <p className="book-description">{book.description || "Not yet description"}</p>

      <div className="book-meta">
        <p>
          <FaUser /> <b>Author:</b> <span>{book.author}</span>
        </p>
        <p>
          <FaBookOpen /> <b>Status:</b> <span>{book.status || "Updating"}</span>
        </p>
        <p>
          <FaEye /> <b>View:</b> <span>{book.views || 0}</span>
        </p>
        <p>
          <b>Follow:</b> <span>{book.followers || 0}</span>
        </p>
        <p>
          <b>Vote:</b> <span>{book.rating}/5 - {book.voteCount} Voted</span>
        </p>
      </div>

      <div className="book-tags">
        {book.categories?.map((tag, index) => (
          <span key={index}>{tag.name}</span>
        ))}
      </div>

      <div className="book-rating">
        {[...Array(5)].map((_, i) =>
          i < book.rating ? <FaStar key={i} /> : <FaRegStar key={i} />
        )}
      </div>
      
      <Quantity />
    </div>
  );
};

export default BookInfo;
