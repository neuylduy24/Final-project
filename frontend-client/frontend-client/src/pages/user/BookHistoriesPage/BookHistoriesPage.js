import React, { useEffect, useState } from "react";
import Sidebar from "../../../component/ProfileUser/SideBar/sideBar";
import "../ProfileUserPage/ProfileUserPage.scss";
import axios from "axios";
import BookCard from "../../../component/Card/bookDetailCard";

const BookHistoriesPage = () => {
  const [historyBooks, setHistoryBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchHistoryBooks = async () => {
      try {
        const response = await axios.get(
          "https://api.it-ebook.io.vn/api/books",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            signal: controller.signal,
          }
        );
        setHistoryBooks(response.data);
      } catch (err) {
        if (axios.isCancel(err)) return;
        setError("Unable to load reading history list.");
        console.error("Error fetching history books:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistoryBooks();

    return () => controller.abort();
  }, []);

  return (
    <div className="profile-page">
      <Sidebar />
      <div className="profile-content">
        <h2>Book History</h2>

        {loading && <p>Loading list...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && historyBooks.length === 0 && (
          <p>You have not read any stories yet.</p>
        )}

        {!loading && !error && historyBooks.length > 0 && (
          <div className="book-list">
            {historyBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookHistoriesPage;
