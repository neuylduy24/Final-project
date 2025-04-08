import React, { useState, useEffect } from "react";
import parseISO from "date-fns/parseISO";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { vi } from "date-fns/locale";
import axios from "axios";
import "./bookDetailCard.scss";
import { useNavigate } from "react-router-dom";
import { ROUTERS } from "utils/path";
import { FaComment, FaEye, FaHeart } from "react-icons/fa6";
import chapterService from "service/chapterService";

const BookCard = ({ book, onChapterClick }) => {
  const navigate = useNavigate();
  const [averageRating, setAverageRating] = useState(0);
  const [topChapterTitle, setTopChapterTitle] = useState("Loading...");
  const [topChapterId, setTopChapterId] = useState(null);
  const [totalViews, setTotalViews] = useState(book.views || 0);
  const [totalFollows, setTotalFollows] = useState(0);
  const [totalComments, setTotalComments] = useState(0);

  let lastUpdated = "Not available";

  // Format numbers to K, M format
  const formatNumber = (num) => {
    if (!num) return "0";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  // Fetch total comments from both book and chapters
  const fetchTotalComments = async () => {
    try {
      // Fetch book comments
      const bookCommentsResponse = await axios.get(
        `https://api.it-ebook.io.vn/api/feedbacks/comments/${book.id}`
      );
      let totalBookComments = 0;
      if (
        bookCommentsResponse.status === 200 &&
        Array.isArray(bookCommentsResponse.data)
      ) {
        totalBookComments = bookCommentsResponse.data.length;
      }

      // Fetch chapters first
      const chaptersResponse = await axios.get(
        `https://api.it-ebook.io.vn/api/chapters/book/${book.id}`
      );
      let totalChapterComments = 0;

      // If chapters exist, fetch comments for each chapter
      if (
        chaptersResponse.status === 200 &&
        Array.isArray(chaptersResponse.data)
      ) {
        const chapters = chaptersResponse.data;

        // Use Promise.all to fetch all chapter comments in parallel
        const chapterCommentsPromises = chapters.map(
          (chapter) =>
            axios
              .get(
                `https://api.it-ebook.io.vn/api/feedbacks/comments/${chapter.id}`
              )
              .then((response) => {
                if (response.status === 200 && Array.isArray(response.data)) {
                  return response.data.length;
                }
                return 0;
              })
              .catch(() => 0) // Return 0 if error fetching chapter comments
        );

        const chapterCommentCounts = await Promise.all(chapterCommentsPromises);
        totalChapterComments = chapterCommentCounts.reduce(
          (sum, count) => sum + count,
          0
        );
      }

      // Set total comments (book comments + chapter comments)
      setTotalComments(totalBookComments + totalChapterComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setTotalComments(0);
    }
  };

  // Fetch book stats (views and follows)
  const fetchBookStats = async () => {
    try {
      // Fetch total views using chapterService if not available in book object
      if (!book.views) {
        const total = await chapterService.getTotalViewsByBookId(book.id);
        setTotalViews(total);
      }

      // Fetch follows
      const response = await axios.get(
        `https://api.it-ebook.io.vn/api/books/${book.id}/details`
      );
      if (response.data) {
        setTotalFollows(response.data.follows || 0);
      }
    } catch (error) {
      console.error("Error fetching book stats:", error);
      setTotalFollows(0);
    }
  };

  // Fetch average rating
  const fetchAverageRating = async () => {
    try {
      const response = await axios.get(
        `https://api.it-ebook.io.vn/api/feedbacks/average-rating/${book.id}`
      );
      setAverageRating(response.data || 0);
    } catch (error) {
      console.error("Error fetching average rating:", error);
      setAverageRating(0);
    }
  };

  // Fetch chapters
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
    if (book.id) {
      Promise.all([
        fetchAverageRating(),
        fetchChaptersByBookId(),
        fetchBookStats(),
        fetchTotalComments(),
      ]);
    }
  }, [book.id]);

  const handleChapterClick = (e) => {
    e.stopPropagation();
    if (topChapterId && book.id) {
      if (onChapterClick) onChapterClick();
      navigate(
        ROUTERS.USER.CHAPTERDETAIL.replace(
          ":id",
          book.bookId || book.id
        ).replace(":chapterId", topChapterId)
      );
    }
  };

  try {
    const updatedDate = book.updatedAt ? parseISO(book.updatedAt) : null;
    const createdDate = book.createdAt ? parseISO(book.createdAt) : null;

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
        <div className="book-img">
          {book.image ? (
            <img src={book.image} alt="cover" />
          ) : book.imageData ? (
            <img src={`data:image/jpeg;base64,${book.imageData}`} alt="cover" />
          ) : (
            <img
              src={`https://api.it-ebook.io.vn/api/books/${book.id}/image`}
              alt="cover"
            />
          )}
          <span className="badge-time">{lastUpdated}</span>
          {averageRating >= 4 && <span className="badge-hot">Hot</span>}
          <div className="book-stats">
            <span>
              <FaEye style={{ marginRight: "5px" }} />
              {formatNumber(totalViews)}
            </span>
            <span>
              <FaComment style={{ marginRight: "5px" }} />
              {formatNumber(totalComments)}
            </span>
          </div>
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
