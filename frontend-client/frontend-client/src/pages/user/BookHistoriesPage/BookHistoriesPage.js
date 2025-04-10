import React, { useEffect, useState } from "react";
import Sidebar from "../../../component/ProfileUser/SideBar/sideBar";
import "../ProfileUserPage/ProfileUserPage.scss";
import axios from "axios";
import BookCard from "../../../component/Book/Card/bookDetailCard";
import { API_BASE_URL } from "../../../api/apiConfig"; // Dùng API_BASE_URL

const BookHistoriesPage = () => {
  const [historyBooks, setHistoryBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchHistoryBooks = async () => {
      try {
        console.log(`Fetching: ${API_BASE_URL}/api/reading-history/user/${email}`);

        const response = await axios.get(`${API_BASE_URL}/api/reading-history/user/${email}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("API Response:", response.data);

        if (!response.data || response.data.length === 0) {
          setError("No reading history found.");
          setHistoryBooks([]);
          return;
        }

        // Fetch chi tiết sách nếu chỉ có bookId
        const booksWithDetails = await Promise.all(
          response.data.map(async (history) => {
            try {
              const bookResponse = await axios.get(`${API_BASE_URL}/api/books/${history.bookId}`);
              return { ...history, book: bookResponse.data };
            } catch (err) {
              console.error(`Failed to fetch book ${history.bookId}:`, err);
              return { ...history, book: null };
            }
          })
        );

        setHistoryBooks(booksWithDetails);
      } catch (err) {
        console.error("Error fetching reading history:", err.response?.data || err);
        setError("Unable to load reading history.");
      } finally {
        setLoading(false);
      }
    };

    // Kiểm tra xem người dùng đã đăng nhập chưa
    if (email && token) {
      fetchHistoryBooks();
    } else {
      setLoading(false);
      setError("Please log in to view your reading history.");
    }
  }, [email, token]);

  return (
    <div className="profile-page">
      <Sidebar />
      <div className="profile-content">
        <h2>Reading History</h2>

        {loading && <p>Loading list...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && historyBooks.length === 0 && (
          <p>You have not read any stories yet.</p>
        )}

        {!loading && !error && historyBooks.length > 0 && (
          <div className="book-list">
            {historyBooks.map((history) => (
              <BookCard key={history.bookId} book={history.book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookHistoriesPage;
