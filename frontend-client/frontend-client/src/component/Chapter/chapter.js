import { memo, useEffect, useState, useCallback } from "react";
import "./chapter.scss";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ROUTERS } from "utils/path";

const Chapter = () => {
  const { id } = useParams(); // Lấy id sách từ URL
  const navigate = useNavigate(); // Hook điều hướng
  const [book, setBook] = useState(null);

  // Hàm fetch dữ liệu sách (bao gồm danh sách chương)
  const fetchBookData = useCallback(() => {
    axios
      .get(`https://api.it-ebook.io.vn/api/books/${id}`)
      .then((response) => setBook(response.data))
      .catch((error) => console.error("Error fetching book data:", error));
  }, [id]);

  useEffect(() => {
    fetchBookData();

    const handleChapterUpdate = (event) => {
      if (event.detail.bookId === id) {
        fetchBookData();
      }
    };

    window.addEventListener("chapterUpdated", handleChapterUpdate);
    return () => {
      window.removeEventListener("chapterUpdated", handleChapterUpdate);
    };
  }, [id, fetchBookData]);

  if (!book) return <p>Loading data...</p>;

  return (
    <div className="chapter-list">
      <h3>List Chapters</h3>
      <ul className="chapter-items">
        {Array.isArray(book.chapters) && book.chapters.length > 0 ? (
          book.chapters.map((chapter, index) => (
            <li
              key={index}
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
                {format(new Date(chapter.createdAt), "dd/MM/yyyy HH:mm")}
              </span>
            </li>
          ))
        ) : (
          <p>Not yet chapter</p>
        )}
      </ul>
    </div>
  );
};

export default memo(Chapter);
