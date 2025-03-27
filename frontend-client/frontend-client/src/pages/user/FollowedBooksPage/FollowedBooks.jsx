import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const FollowedBooks = () => {
  const [followedBooks, setFollowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowedBooks = async () => {
      try {
        const response = await axios.get("/api/followed-books", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setFollowedBooks(response.data);
      } catch (error) {
        console.error("Error fetching followed books:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFollowedBooks();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (followedBooks.length === 0) return <p>Bạn chưa theo dõi truyện nào.</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Truyện Đang Theo Dõi</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {followedBooks.map((book) => (
          <div key={book.id} className="bg-white rounded-lg shadow-md p-4">
            <img src={book.image} alt={book.title} className="w-full h-48 object-cover rounded" />
            <h3 className="text-lg font-semibold mt-2">{book.title}</h3>
            <p className="text-gray-600">Tác giả: {book.author}</p>
            <p className="text-gray-500 text-sm">Chương mới nhất: {book.latestChapter}</p>
            <Link to={`/book/${book.id}`} className="block mt-2 text-blue-500">Đọc ngay</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FollowedBooks;