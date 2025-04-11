import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { ROUTERS } from "utils/path";
import axios from "axios"; // Import axios
import "./BookCarousel.scss";

const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 6 },
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 5 },
  tablet: { breakpoint: { max: 1024, min: 768 }, items: 3 },
  mobile: { breakpoint: { max: 768, min: 0 }, items: 2 },
};

const BookCarousel = ({ navigate }) => {
  const [books, setBooks] = useState([]); // State để lưu danh sách sách

  // Lấy dữ liệu sách từ API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          "https://api.it-ebook.io.vn/api/recommendations/personalized"
        );
        setBooks(response.data); // Cập nhật dữ liệu sách vào state
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []); // Chạy khi component mount

  return (
    <div className="container_categories_slider">
      <Carousel
        className="categories_slider"
        responsive={responsive}
        autoPlay={true}
        autoPlaySpeed={3500}
        infinite={true}
        arrows={true}
      >
        {books.map((book) => (
          <div
            className="carousel-item"
            key={book.id}
            onClick={() =>
              navigate(`${ROUTERS.USER.BOOKDETAIL.replace(":id", book.id)}`)
            }
          >
            <img
              src={
                book.image
                  ? book.image
                  : book.imageData
                  ? `data:image/jpeg;base64,${book.imageData}`
                  : "default-image-url.jpg" // fallback nếu không có cả hai
              }
              alt={book.title}
              className="slider-image"
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default BookCarousel;
