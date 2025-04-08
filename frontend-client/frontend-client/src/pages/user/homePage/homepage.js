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

  useEffect(() => {
    const token = localStorage.getItem("token");
  
    const fetchBooks = async () => {
      try {
        const res = await axios.get(API_URL, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
  
        const categoryData = res.data;
        const allBooks = Object.values(categoryData).flat(); // ✅ gom tất cả sách lại thành 1 mảng
  
        setBooks(allBooks);
      } catch (error) {
        console.error("Lỗi khi gọi API recommend-by-categories:", error);
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
            <h2>Book hot</h2>
          </div>
          <BookHotPage books={memoizedBooks} navigate={navigate} />
        </div>
      </div>
    </>
  );
};

export default HomePage;
