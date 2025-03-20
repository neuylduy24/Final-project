import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import "./bookDetail.scss";
import { Chapter } from "component";
import BreadCrumb from "../theme/breadCrumb/breadCrumb";
import Comment from "component/Comment/comment";
import BookInfo from "../../../component/BookInfor/Bookinfor";

const BookDetailProductPage = () => {
  const { id } = useParams();
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
      <BreadCrumb name={location.state?.name || book.title || "Đang tải..."} />
      <div className="row-detail">
        <div className="col-lg-3 col-md-4 book-image">
          <img src={book.image} alt={book.title} className="book-cover" />
        </div>
        <BookInfo book={book} />
      </div>
      <Chapter />
      <Comment />
    </div>
  );
};

export default BookDetailProductPage;
