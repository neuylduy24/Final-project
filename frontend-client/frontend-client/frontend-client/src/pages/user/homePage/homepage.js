import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BookCarousel from "../../../component/Book/Carousel/BookCarousel";
import FeaturedBooks from "../../../component/Book/Featured/FeaturedBooks";
import "./home.scss";

const API_URL = "https://api.it-ebook.io.vn/api/books";

const HomePage = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => setBooks(response.data))
      .catch((error) => console.error("Error fetching data:", error));
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
          <FeaturedBooks books={memoizedBooks} navigate={navigate} />
        </div>
        
      </div>
      <div className="see-more-container">
          <button className="see-more-button">See More</button>
        </div>
    </>
  );
};

export default HomePage;
