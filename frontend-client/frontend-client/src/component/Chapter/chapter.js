import { memo, useEffect, useState, useCallback } from "react";
import "./chapter.scss";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
import { ROUTERS } from "utils/path";

const Chapter = () => {
  const { id } = useParams(); // Lấy id sách từ URL
  const navigate = useNavigate(); // Hook điều hướng
  const [book, setBook] = useState(null);
  const [chapters, setChapters] = useState([]); // Separate state for chapters
  const [searchTerm, setSearchTerm] = useState(""); // State tìm kiếm
  const [sortOrder, setSortOrder] = useState("desc"); // State sắp xếp: "desc" (mới -> cũ), "asc" (cũ -> mới)

  // Hàm fetch dữ liệu sách
  const fetchBookData = useCallback(() => {
    axios
      .get(`https://api.it-ebook.io.vn/api/books/${id}`)
      .then((response) => setBook(response.data))
      .catch((error) => console.error("Error fetching book data:", error));
  }, [id]);

  // Hàm fetch dữ liệu chapters
  const fetchChapters = useCallback(() => {
    axios
      .get(`https://api.it-ebook.io.vn/api/chapters?bookId=${id}`)
      .then((response) => {
        console.log("Chapters data for book ID:", id, response.data);
        // Filter to ensure only chapters for this book are shown
        const filteredChapters = response.data.filter(chapter => chapter.bookId === id);
        setChapters(filteredChapters);
      })
      .catch((error) => console.error("Error fetching chapters:", error));
  }, [id]);

  useEffect(() => {
    fetchBookData();
    fetchChapters(); // Fetch chapters separately

    const handleChapterUpdate = (event) => {
      if (event.detail.bookId === id) {
        fetchBookData();
        fetchChapters(); // Refresh chapters on update
      }
    };

    window.addEventListener("chapterUpdated", handleChapterUpdate);
    return () => {
      window.removeEventListener("chapterUpdated", handleChapterUpdate);
    };
  }, [id, fetchBookData, fetchChapters]);

  if (!book) return <p>Loading data...</p>;

  // Lọc và sắp xếp danh sách chapter
  const filteredChapters = chapters
    ?.filter((chapter) =>
      chapter.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "desc"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );

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
          filteredChapters.map((chapter, index) => (
            <li
              key={chapter.id} // Use chapter.id instead of index for better React performance
              className="chapter-item"
              onClick={() =>
                navigate(
                  ROUTERS.USER.CHAPTERDETAIL.replace(":id", id).replace(
                    ":chapterId",
                    chapter.id
                  )
                )
              }
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
