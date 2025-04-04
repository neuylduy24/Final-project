import React, { useState, useEffect } from "react";
import parseISO from "date-fns/parseISO";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { vi } from "date-fns/locale";
import axios from "axios";
import "./bookDetailCard.scss";
import { useNavigate } from "react-router-dom";
import { ROUTERS } from "utils/path";

const BookCard = ({ book, onChapterClick }) => {
  const navigate = useNavigate();
  const [averageRating, setAverageRating] = useState(0);
  const [topChapterTitle, setTopChapterTitle] = useState("Loading...");
  const [topChapterId, setTopChapterId] = useState(null);
  let lastUpdated = "Not available";

  // 📌 Fetch average rating
  const fetchAverageRating = async () => {
    try {
      const response = await axios.get(
        `https://api.it-ebook.io.vn/api/feedbacks/average-rating/${book.id}`
      );
      setAverageRating(response.data || 0);
    } catch (error) {
      console.error("Error fetching average rating:", error);
    }
  };

  // 📌 Fetch chapters and determine newest or most viewed
  const fetchChaptersByBookId = async () => {
    try {
      const response = await axios.get(
        `https://api.it-ebook.io.vn/api/chapters/book/${book.id}`
      );
      const chapters = response.data;

      if (Array.isArray(chapters) && chapters.length > 0) {
        const mostViewed = chapters.reduce((a, b) =>
          a.views > b.views ? a : b
        );

        setTopChapterTitle(`${mostViewed.title}`);
        setTopChapterId(mostViewed.id);
      } else {
        setTopChapterTitle("Not yet chapter");
      }
    } catch (error) {
      console.error("Error fetching chapters:", error);
      setTopChapterTitle("Error loading chapters");
    }
  };

  useEffect(() => {
    fetchAverageRating();
    fetchChaptersByBookId(); // Gọi API lấy chapter
  }, [book.id]);
  const handleChapterClick = (e) => {
    e.stopPropagation(); // Ngăn việc click lan sang book card

    if (topChapterId && book.id) {
      // Gọi onChapterClick trước (ẩn tìm kiếm)
      if (onChapterClick) onChapterClick();

      // Điều hướng đến chi tiết chapter
      navigate(
        ROUTERS.USER.CHAPTERDETAIL.replace(
          ":id",
          book.bookId || book.id
        ).replace(":chapterId", topChapterId)
      );
      if (onChapterClick) onChapterClick(); // 👉 Gọi hàm từ SearchBar để ẩn kết quả
    }
  };

  try {
    const updatedDate = book.updatedAt ? parseISO(book.updatedAt) : null;
    const createdDate = book.createdAt ? parseISO(book.createdAt) : null;
    console.log("createdAt:", book.createdAt);
    console.log("updatedAt:", book.updatedAt);

    if (updatedDate && !isNaN(updatedDate.getTime())) {
      lastUpdated = formatDistanceToNow(updatedDate, {
        addSuffix: true,
        locale: vi,
      });
    } else if (createdDate && !isNaN(createdDate.getTime())) {
      lastUpdated = formatDistanceToNow(createdDate, {
        addSuffix: true,
        locale: vi,
      });
    }
  } catch (error) {
    console.error("Error parsing date:", error);
  }

  return (
    <div
      className="col-lg-2 col-md-4 col-sm-6 col-xs-6"
      key={book.id}
      onClick={() =>
        navigate(
          `${ROUTERS.USER.BOOKDETAIL.replace(":id", book.bookId || book.id)}`
        )
      }
      style={{ cursor: "pointer" }}
    >
      <div className="book-card">
        <div
          className="book-img"
          style={{ backgroundImage: `url(${book.image})` }}
        >
          <span className="badge-time">{lastUpdated}</span>
          {book.rating >= 4 && <span className="badge-hot">Hot</span>}
        </div>
        <div className="book-info">
          <h4>{book.title}</h4>
          <p
            onClick={handleChapterClick}
            className={topChapterId ? "has-chapter" : ""}
          >
            {topChapterTitle}
          </p>

          <span className="rating">
            ⭐ {averageRating ? averageRating.toFixed(1) : "Not yet rated"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
