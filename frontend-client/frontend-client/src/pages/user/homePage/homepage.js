import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BookCarousel from "../../../component/Book/Carousel/BookCarousel";
import "./home.scss";
import BookHotPage from "../TopBookPage/topBook";

const API_URL = "https://api.it-ebook.io.vn/api/books/recommend-by-categories";

const HomePage = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setHasToken(!!token);
    const fetchBooks = async () => {
      try {
        let res;
        if (token) {
          // Nếu có token, lấy sách đề xuất theo danh mục (recommend/favorite)
          res = await axios.get("https://api.it-ebook.io.vn/api/books/recommend-by-categories", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } else {
          // Nếu không có token, gọi API công khai để lấy tất cả sách
          res = await axios.get("https://api.it-ebook.io.vn/api/books"); // 🔁 API này bạn cần confirm lại
        }
  
        setBooks(res.data);
      } catch (error) {
        console.error("Lỗi khi gọi API sách:", error);
      }
    };
  
    fetchBooks();
  }, []);
  
  
  
  

  const memoizedBooks = useMemo(() => books, [books]);

  return (
    <>
      <BookCarousel books={memoizedBooks} navigate={navigate} />
      <div className="container">
        <div className="featured">
          <div className="section-title">
          <h2>{hasToken ? "Book for you" : "Book hot"}</h2>
          </div>
          <BookHotPage books={memoizedBooks} navigate={navigate} />

        </div>
      </div>
    </>
  );
};

export default HomePage;
