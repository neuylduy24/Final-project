import React, { useEffect, useState } from "react";
import { FaEye, FaStar, FaRegStar } from "react-icons/fa6";
import { FaUser, FaBookOpen } from "react-icons/fa";
import ButtonFollow from "component/Action/ButtonFollow/buttonFollow";
import chapterService from "service/chapterService";
import axios from "axios";
import { toast } from "react-toastify";
import "./bookinfor.scss";

const BookInfo = ({ book }) => {
  const [totalViews, setTotalViews] = useState(book.views || 0);
  const [userRating, setUserRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [averageRating, setAverageRating] = useState(book.rating || 0);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!book.views) {
      chapterService
        .getTotalViewsByBookId(book.id)
        .then((total) => setTotalViews(total))
        .catch((error) => console.error("Error fetching total views:", error));
    }

    // Fetch average rating
    fetchAverageRating();
    
    // Fetch user's previous rating if logged in
    if (token) {
      fetchUserRating();
    }
  }, [book.id, book.views, token]);

  const fetchAverageRating = async () => {
    try {
      const response = await axios.get(
        `https://api.it-ebook.io.vn/api/feedbacks/average-rating/${book.id}`
      );
      setAverageRating(response.data);
    } catch (error) {
      console.error("Error fetching average rating:", error);
    }
  };

  // Store the user's rating ID when fetching it
  const [userRatingId, setUserRatingId] = useState(null);

  const fetchUserRating = async () => {
    try {
      const response = await axios.get(
        `https://api.it-ebook.io.vn/api/feedbacks/ratings/${book.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Get user email from token (assuming you have a function to decode JWT)
      const userEmail = getUserEmailFromToken(token);
      
      // Find the user's rating from the returned list by matching userId (email)
      if (response.data && response.data.length > 0) {
        const userRatingData = response.data.find(rating => rating.userId === userEmail);
        if (userRatingData) {
          setUserRating(userRatingData.rating);
          setUserRatingId(userRatingData.id);
        }
      }
    } catch (error) {
      console.error("Error fetching user rating:", error);
    }
  };

  // Helper function to extract email from JWT token
  const getUserEmailFromToken = (token) => {
    try {
      // Simple JWT decode (base64)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const payload = JSON.parse(jsonPayload);
      return payload.sub || payload.email; // Depending on your JWT structure
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const handleRatingClick = async (rating) => {
    if (!token) {
      toast.error("Please login to rate this book!");
      return;
    }

    try {
      if (userRatingId) {
        // Update existing rating
        await axios.put(
          `https://api.it-ebook.io.vn/api/feedbacks/${userRatingId}`,
          { rating: rating },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Rating updated successfully!");
      } else {
        // Create new rating
        const response = await axios.post(
          "https://api.it-ebook.io.vn/api/feedbacks",
          { 
            bookId: book.id, 
            rating: rating, 
            type: "RATING",
            content: null  // API requires content field
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Store the new rating ID
        if (response.data && response.data.id) {
          setUserRatingId(response.data.id);
        }
        toast.success("Rating submitted successfully!");
      }
      
      setUserRating(rating);
      
      // Refresh average rating
      fetchAverageRating();
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error("Failed to submit rating.");
    }
  };

  return (
    <div className="book-info">
      <h2 className="book-title">{book.title}</h2>
      <p className="book-description">
        {book.description || "Not yet description"}
      </p>

      <div className="book-meta">
        <p>
          <FaUser /> <b>Author:</b> <span>{book.author}</span>
        </p>
        <p>
          <FaBookOpen /> <b>Status:</b> <span>{book.status || "Updating"}</span>
        </p>
        <p>
          <FaEye /> <b>View:</b> <span>{totalViews}</span>
        </p>
        <p>
          <FaStar /> <b>Rating:</b>{" "}
          <span>{averageRating ? averageRating.toFixed(1) : "0.0"}/5</span>
        </p>
      </div>

      <div className="book-tags">
        {book.categories?.length ? (
          book.categories.map((tag, index) => (
            <span key={index}>{tag.name}</span>
          ))
        ) : (
          <span className="no-tags">No Categories</span>
        )}
      </div>

      <div className="book-rating">
        <p className="rating-label">Rate this book:</p>
        <div className="star-rating">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className="rating-star"
              onMouseEnter={() => setHoveredRating(i + 1)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => handleRatingClick(i + 1)}
            >
              {i < (hoveredRating || userRating) ? (
                <FaStar className="star-filled" />
              ) : (
                <FaRegStar className="star-empty" />
              )}
            </span>
          ))}
        </div>
        <div className="average-rating">
          {userRating > 0 && <p className="user-rating">Your rating: {userRating}/5</p>}
        </div>
      </div>
      <ButtonFollow bookId={book.id} />
    </div>
  );
};

export default BookInfo;
