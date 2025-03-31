import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "component/ProfileUser/SideBar/sideBar";
import BookCard from "component/Card/bookDetailCard"; // Import BookCard
import { toast, ToastContainer } from "react-toastify";
import "../ProfileUserPage/ProfileUserPage.scss"

const API_URL = "https://api.it-ebook.io.vn/api/books"; // API lấy chi tiết sách

const FollowedBooks = () => {
  const [followedBooks, setFollowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("email");

    if (!token || !userId) {
      toast.error("You need to login to see the list of stories you are following.!");
      return;
    }

    const fetchFollowedBooks = async () => {
      try {
        // 1️⃣ Gọi API để lấy danh sách bookId mà user theo dõi
        const response = await axios.get(
          `https://api.it-ebook.io.vn/api/follow-books/user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200 && Array.isArray(response.data)) {
          const uniqueBookIds = Array.from(
            new Set(response.data.map((book) => book.bookId))
          );

          // 2️⃣ Gọi API /api/books để lấy thông tin chi tiết sách
          const booksData = await Promise.all(
            uniqueBookIds.map(async (bookId) => {
              try {
                const bookResponse = await axios.get(`${API_URL}/${bookId}`);
                return bookResponse.data; // Lấy dữ liệu sách từ API
              } catch (error) {
                console.error(`Lỗi lấy dữ liệu sách ID ${bookId}:`, error);
                return null; // Bỏ qua sách lỗi
              }
            })
          );

          // 3️⃣ Lọc bỏ các book null (nếu API lỗi)
          const filteredBooks = booksData.filter((book) => book !== null);
          setFollowedBooks(filteredBooks);
          setError(null);
        } else {
          throw new Error(`API trả về lỗi: ${response.status}`);
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        toast.error(`Error getting list of stories to follow: ${errorMessage}`);
        setError(errorMessage);
        setFollowedBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowedBooks();
  }, [navigate]);

  return (
    <div className="profile-page">
      <Sidebar />
      <div className="profile-content">
      <ToastContainer position="top-right" autoClose={1500} />
        <h2>Book Followed</h2>

        {loading ? (
          <p>Loading list books...</p>
        ) : error ? (
          <p className="error-message">❌ {error}</p>
        ) : followedBooks.length > 0 ? (
          <div className="book-list">
            {followedBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <p>Not yet followed book! 📚</p>
        )}
      </div>
    </div>
  );
};

export default FollowedBooks;
