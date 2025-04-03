import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "component/ProfileUser/SideBar/sideBar";
import BookCard from "component/Book/Card/bookDetailCard"; // Import BookCard
import { toast, ToastContainer } from "react-toastify";
import "../ProfileUserPage/ProfileUserPage.scss";

const API_URL = "https://api.it-ebook.io.vn/api/books"; // API lấy chi tiết sách

const FollowedBooks = () => {
  const [followedBooks, setFollowedBooks] = useState([]); // Dữ liệu sách đã theo dõi
  const [loading, setLoading] = useState(true); // Trạng thái đang tải
  const [error, setError] = useState(null); // Trạng thái lỗi
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // Lấy token từ localStorage
  const email = localStorage.getItem("email"); // Lấy email từ localStorage

  // Hàm lấy danh sách sách theo dõi
  useEffect(() => {
    const fetchFollowedBooks = async () => {
      try {
        // Kiểm tra nếu đã đăng nhập
        if (!email || !token) {
          setLoading(false);
          setError("Please log in to view followed books.");
          return;
        }

        // Gửi yêu cầu API để lấy sách đã theo dõi
        const response = await axios.get(
          `https://api.it-ebook.io.vn/api/follow-books/user/${email}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200 && Array.isArray(response.data)) {
          if (response.data.length === 0) {
            setFollowedBooks([]); // Không có sách nào được theo dõi
            setLoading(false);
            return;
          }

          const uniqueBookIds = Array.from(
            new Set(response.data.map((book) => book.bookId))
          );

          // Lấy chi tiết các sách theo ID sách
          const booksData = await Promise.all(
            uniqueBookIds.map(async (bookId) => {
              try {
                const bookResponse = await axios.get(`${API_URL}/${bookId}`);
                return bookResponse.data;
              } catch (error) {
                console.error(`Lỗi lấy dữ liệu sách ID ${bookId}:`, error);
                return null;
              }
            })
          );

          const filteredBooks = booksData.filter((book) => book !== null);
          setFollowedBooks(filteredBooks); // Cập nhật sách đã theo dõi
          setError(null);
        } else {
          throw new Error(`API trả về lỗi: ${response.status}`);
        }
      } catch (error) {
        if (error.response?.status === 404) {
          // Nếu không có sách nào được theo dõi
          setFollowedBooks([]);
        } else {
          const errorMessage = error.response?.data?.message || error.message;
          toast.error(
            `Error getting followed books list: ${errorMessage}`
          );
          setError(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFollowedBooks();
  }, [email, token]);

  return (
    <div className="profile-page">
      <Sidebar />
      <div className="profile-content">
        <ToastContainer position="top-right" autoClose={1500} />
        <h2>Followed Books</h2>

        {loading ? (
          <p>Loading followed books...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : followedBooks.length > 0 ? (
          <div className="book-list">
            {followedBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <p>You haven't followed any books yet! 📚</p>
        )}
      </div>
    </div>
  );
};

export default FollowedBooks;
