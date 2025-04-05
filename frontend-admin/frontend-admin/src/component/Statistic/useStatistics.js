import { useState, useEffect } from "react";
import axios from "axios";

const useStatistics = () => {
  const [bookStats, setBookStats] = useState([]);
  const [userStats, setUserStats] = useState({
    adminCount: 0,
    authorCount: 0,
    readerCount: 0,
    totalUsers: 0
  });
  const [commentStats, setCommentStats] = useState([]);
  const [viewTrends, setViewTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        
        // Lấy thống kê sách
        const booksResponse = await axios.get("https://api.it-ebook.io.vn/api/statistics/books");
        setBookStats(booksResponse.data.slice(0, 5)); // Lấy 5 sách có lượt xem cao nhất
        
        // Lấy thống kê người dùng
        const usersResponse = await axios.get("https://api.it-ebook.io.vn/api/statistics/users");
        setUserStats({
          adminCount: usersResponse.data.adminCount || 0,
          authorCount: usersResponse.data.authorCount || 0,
          readerCount: usersResponse.data.readerCount || 0,
          totalUsers: usersResponse.data.totalUsers || 0
        });
        
        // Lấy thống kê bình luận
        const commentsResponse = await axios.get("https://api.it-ebook.io.vn/api/statistics/comments");
        setCommentStats(commentsResponse.data.slice(0, 5)); // Lấy 5 sách có nhiều bình luận nhất
        
        // Lấy xu hướng lượt xem theo thời gian
        const trendsResponse = await axios.get("https://api.it-ebook.io.vn/api/statistics/trends");
        setViewTrends(trendsResponse.data);
        
        setError(null);
      } catch (err) {
        console.error("Error fetching statistics:", err);
        setError("Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.");
        
        // Sử dụng dữ liệu mẫu nếu API không hoạt động
        setMockData();
      } finally {
        setLoading(false);
      }
    };
    
    fetchStatistics();
  }, []);
  
  // Hàm tạo dữ liệu mẫu khi API không hoạt động
  const setMockData = () => {
    // Dữ liệu mẫu cho sách
    setBookStats([
      { title: "Đắc Nhân Tâm", views: 1200, likes: 450 },
      { title: "Nhà Giả Kim", views: 980, likes: 320 },
      { title: "Tôi Tài Giỏi, Bạn Cũng Thế", views: 850, likes: 280 },
      { title: "Đọc Vị Bất Kỳ Ai", views: 720, likes: 210 },
      { title: "Người Giàu Có Nhất Thành Babylon", views: 650, likes: 190 }
    ]);
    
    // Dữ liệu mẫu cho người dùng
    setUserStats({
      adminCount: 3,
      authorCount: 15,
      readerCount: 120,
      totalUsers: 138
    });
    
    // Dữ liệu mẫu cho bình luận
    setCommentStats([
      { bookTitle: "Đắc Nhân Tâm", commentCount: 45 },
      { bookTitle: "Nhà Giả Kim", commentCount: 32 },
      { bookTitle: "Tôi Tài Giỏi, Bạn Cũng Thế", commentCount: 28 },
      { bookTitle: "Đọc Vị Bất Kỳ Ai", commentCount: 21 },
      { bookTitle: "Người Giàu Có Nhất Thành Babylon", commentCount: 19 }
    ]);
    
    // Dữ liệu mẫu cho xu hướng
    const today = new Date();
    setViewTrends(
      Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() - (6 - i));
        return {
          date: date.toISOString().split('T')[0],
          views: Math.floor(Math.random() * 500) + 100
        };
      })
    );
  };

  return { bookStats, userStats, commentStats, viewTrends, loading, error };
};

export default useStatistics;
