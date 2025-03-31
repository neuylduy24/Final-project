import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import "./bookDetail.scss";
import { Chapter } from "component";
import BreadCrumb from "../theme/breadCrumb/breadCrumb";
import Comment from "component/Comment/comment";
import BookInfo from "../../../component/BookInfor/Bookinfor";

const BookDetailProductPage = () => {
  const { id: bookId } = useParams();
  const [book, setBook] = useState(null);
  const [comments, setComments] = useState([]);
  const location = useLocation();
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`https://api.it-ebook.io.vn/api/books/${bookId}`)
      .then((response) => setBook(response.data))
      .catch((error) => console.error("Error fetching book data:", error));
  }, [bookId]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `https://api.it-ebook.io.vn/api/feedbacks/comments/${bookId}`
        );
        console.log("API Response:", response.data); // 🔍 Debug API Response
        setComments(response.data); // ✅ Cập nhật state với dữ liệu API
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [bookId]); // ✅ Gọi API khi bookId thay đổi

  const handleCommentAdded = (newComment) => {
    setComments((prevComments) => [newComment, ...prevComments]);
  };

  const emailColors = ["#ff5733", "#33ff57", "#3357ff", "#ff33a1", "#f39c12", "#18a6be", "#24e948"];
  const getRandomColor = () => emailColors[Math.floor(Math.random() * emailColors.length)];

  if (!book) return <p>Loading data...</p>;

  return (
    <div className="container book-detail-container">
      <BreadCrumb name={location.state?.name || book.title || "Loading..."} />
      <div className="row-detail">
        <div className="col-lg-3 col-md-4 book-image">
          <img src={book.image} alt={book.title} className="book-cover" />
        </div>
        <BookInfo book={book} />
      </div>
      <Chapter />
      <Comment bookId={bookId} token={token} onCommentAdded={handleCommentAdded} />

      {/* ✅ Hiển thị danh sách comments */}
      <div className="comment-section">
        <h3 className="comment-title">All Comments</h3>
        {comments.length === 0 ? (
          <p className="no-comments">No comments yet.</p>
        ) : (
          <ul className="comment-list">
            {comments.map((comment) => (
              <li key={comment.id} className="comment-item">
                <h3 className="email" style={{ color: getRandomColor() }}>
                  {comment.userId}
                </h3>
                <p className="comment-content">{comment.content}</p>
                <small className="comment-date">
                  {new Date(comment.createdAt).toLocaleString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default BookDetailProductPage;
