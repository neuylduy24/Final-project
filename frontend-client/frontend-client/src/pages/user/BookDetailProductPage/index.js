import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { FaEye, FaStar, FaRegStar } from "react-icons/fa6";
import { FaUser, FaBookOpen } from "react-icons/fa";
import axios from "axios";
import "./style.scss";
import { Chapter, Quantity } from "component";
import BreadCrumb from "../theme/breadCrumb";

const BookDetailProductPage = () => {
  const { id } = useParams(); // Lấy id sách từ URL
  const [book, setBook] = useState(null);
  const location = useLocation();

  useEffect(() => {
    axios
      .get(`https://api.it-ebook.io.vn/api/books/${id}`)
      .then((response) => setBook(response.data))
      .catch((error) => console.error("Error taking data books:", error));
  }, [id]);

  if (!book) return <p>Loading data...</p>;

  return (
    <div className="container book-detail-container">
      <BreadCrumb name={location.state?.name || book.title || "Đang tải..."}/>
      <div className="row-detail">
        <div className="col-lg-3 col-md-4 book-image">
          <img src={book.image} alt={book.title} className="book-cover" />
        </div>

        <div className="col-lg-9 col-md-8 book-info">
          <h2 className="book-title">{book.title}</h2>
          <p className="book-description">{book.description || "Not yet description"}</p>

          <div className="book-meta">
            <p>
              <FaUser /> <b>Author:</b> <span>{book.author}</span>
            </p>
            <p>
              <FaBookOpen /> <b>Status:</b>{" "}
              <span>{book.status || "Updating"}</span>
            </p>
            <p>
              <FaEye /> <b>View:</b> <span>{book.views || 0}</span>
            </p>
            <p>
              <b>Follow:</b> <span>{book.followers || 0}</span>
            </p>
            <p>
              <b>Vote:</b>{" "}
              <span>
                {book.rating}/5 - {book.voteCount}Voted
              </span>
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
          <Quantity/>
        </div>
      </div>
      <Chapter/>
      <div className="comment-section">
        <h3>Comment</h3>
        <input placeholder="Enter your comment" />
        <button className="btn btn-comment">Submit</button>
      </div>
    </div>
  );
};

export default BookDetailProductPage;
