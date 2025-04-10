import { memo, useEffect, useState, useCallback } from "react";
import "./chapter.scss";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
import { ROUTERS } from "utils/path";
// Giả sử bạn đã import cấu hình API nếu cần


import { API_BASE_URL, API_ENDPOINTS } from "../../../api/apiConfig";


const Chapter = () => {
  const { id } = useParams(); // Lấy id sách từ URL
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  // Hàm fetch dữ liệu sách
  const fetchBookData = useCallback(() => {
    axios
      .get(`${API_BASE_URL}/api/books/${id}`)
      .then((response) => setBook(response.data))
      .catch((error) => console.error("Error fetching book data:", error));
  }, [id]);

  // Hàm fetch danh sách chapters
  const fetchChapters = useCallback(() => {
    axios
      .get(`${API_BASE_URL}/api/chapters?bookId=${id}`)
      .then((response) => {
        const filteredChapters = response.data.filter(
          (chapter) => chapter.bookId === id
        );
        setChapters(filteredChapters);
      })
      .catch((error) => console.error("Error fetching chapters:", error));
  }, [id]);

  useEffect(() => {
    fetchBookData();
    fetchChapters();

    const handleChapterUpdate = (event) => {
      if (event.detail.bookId === id) {
        fetchBookData();
        fetchChapters();
      }
    };

    window.addEventListener("chapterUpdated", handleChapterUpdate);
    return () => {
      window.removeEventListener("chapterUpdated", handleChapterUpdate);
    };
  }, [id, fetchBookData, fetchChapters]);

  if (!book) return <p>Loading data...</p>;

  const filteredChapters = chapters
    ?.filter((chapter) =>
      chapter.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "desc"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );

  // Hàm lưu lịch sử đọc khi người dùng chọn chương
  const handleChapterClick = async (chapter) => {
    try {
      // Sử dụng endpoint đúng: UPDATE_READING_PROGRESS từ apiConfig.js
      await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.UPDATE_READING_PROGRESS}`,
        {
          email,
          // Nếu có userId trong localStorage, thêm vào payload
          userId: localStorage.getItem("email"),
          bookId: id,
          chapterId: chapter.id,
          // Nếu backend yêu cầu thêm progress hoặc timeSpent, có thể thêm:
          progress: 0,
          timeSpent: 0,
          lastReadAt: new Date().toISOString(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Lưu lịch sử đọc thành công!");
    } catch (error) {
      console.error("Lỗi khi lưu lịch sử đọc:", error.response?.data || error.message);
    }
    // Điều hướng đến trang đọc chương
    navigate(
      ROUTERS.USER.CHAPTERDETAIL.replace(":id", id).replace(":chapterId", chapter.id)
    );
  };

  return (
    <div className="chapter-list">
      <h3>List Chapters</h3>

      <div className="search-sort-container">
        <input
          type="text"
          placeholder="Search chapters..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <button
          onClick={() =>
            setSortOrder((prevOrder) => (prevOrder === "desc" ? "asc" : "desc"))
          }
          className="sort-button"
        >
          {sortOrder === "desc" ? <FaSortAmountDown /> : <FaSortAmountUp />}
        </button>
      </div>

      <ul className="chapter-items">
        {Array.isArray(filteredChapters) && filteredChapters.length > 0 ? (
          filteredChapters.map((chapter) => (
            <li
              key={chapter.id}
              className="chapter-item"
              onClick={() => handleChapterClick(chapter)}
              style={{ cursor: "pointer" }}
            >
              <span className="chapter-title">{chapter.title}</span>
              <span className="chapter-date">
                {formatDistanceToNow(new Date(chapter.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </li>
          ))
        ) : (
          <p>No chapters found</p>
        )}
      </ul>
    </div>
  );
};

export default memo(Chapter);
