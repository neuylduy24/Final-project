import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { ROUTERS } from "utils/path";
import "./BookCarousel.scss";

const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 6 },
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 5 },
  tablet: { breakpoint: { max: 1024, min: 768 }, items: 3 },
  mobile: { breakpoint: { max: 768, min: 0 }, items: 2 },
};

const BookCarousel = ({ books, navigate }) => {
  return (
    <div className="container_categories_slider">
      <Carousel className="categories_slider" responsive={responsive} autoPlay={true} autoPlaySpeed={2000} infinite={true} arrows={true}>
        {books.map((book) => (
          <div className="carousel-item" key={book.id} onClick={() => navigate(`${ROUTERS.USER.BOOKDETAIL.replace(":id", book.id)}`)}>
            <img src={book.image} alt={book.title} className="slider-image" />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default BookCarousel;
