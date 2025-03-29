import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const FollowedBooks = () => {
    const [followedBooks, setFollowedBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!token || !userId) {
            alert("Bạn cần đăng nhập để xem danh sách truyện đang theo dõi!");
            navigate("/login");
            return;
        }

        const fetchFollowedBooks = async () => {
            try {
                const response = await axios.get(
                    `https://api.it-ebook.io.vn/api/follow-books/user/${userId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                
                console.log("API Response:", response.data);
                
                if (response.status === 200 && Array.isArray(response.data)) {
                    // Loại bỏ các mục trùng lặp dựa trên bookId
                    const uniqueBooks = Array.from(new Map(response.data.map(book => [book.bookId, book])).values());
                    setFollowedBooks(uniqueBooks);
                } else {
                    console.error("API trả về lỗi:", response.status);
                    setFollowedBooks([]);
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách truyện theo dõi:", error.response?.data || error.message);
                setFollowedBooks([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFollowedBooks();
    }, []); // Chỉ chạy một lần khi component mount

    // Dùng useMemo để tối ưu danh sách truyện
    const filteredBooks = useMemo(() => {
        return Array.from(new Map(followedBooks.map(book => [book.bookId, book])).values());
    }, [followedBooks]);

    if (loading) return <p>Đang tải...</p>;
    if (!filteredBooks.length) return <p>Bạn chưa theo dõi truyện nào.</p>;

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Truyện Đang Theo Dõi</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredBooks.map((book, index) => (
                    <div key={`${book.bookId}-${index}`} className="bg-white rounded-lg shadow-md p-4">
                        <img
                            src={book.image || "https://via.placeholder.com/150"}
                            alt={book.title || "Truyện không có tiêu đề"}
                            className="w-full h-48 object-cover rounded"
                        />
                        <h3 className="text-lg font-semibold mt-2">{book.title || "Không có tiêu đề"}</h3>
                        <p className="text-gray-600">Tác giả: {book.author || "Không rõ"}</p>
                        <p className="text-gray-500 text-sm">
                            Chương mới nhất: {book.latestChapter || "Chưa có"}
                        </p>
                        <Link to={`/book/${book.bookId}`} className="block mt-2 text-blue-500">Đọc ngay</Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FollowedBooks;