import { useEffect, useState, memo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./navigationChapter.scss";
import { ROUTERS } from "utils/path";

const NavigationChapter = () => {
  const { id, chapterId } = useParams(); // Lấy ID sách & chương từ URL
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [chapterIndex, setChapterIndex] = useState(0);

  const fetchBookData = useCallback(() => {
    axios
      .get(`https://api.it-ebook.io.vn/api/books/${id}`)
      .then((response) => {
        setBook(response.data);
        const foundIndex = response.data.chapters?.findIndex(
          (ch) => ch.id === chapterId
        );
        setChapterIndex(foundIndex);
        setCurrentChapter(response.data.chapters?.[foundIndex] || null);
      })
      .catch((error) => console.error("Error fetching book data:", error));
  }, [id, chapterId]);

  useEffect(() => {
    fetchBookData();
  }, [fetchBookData]);

  const handlePrevChapter = () => {
    if (chapterIndex > 0) {
      const prevChapter = book.chapters[chapterIndex - 1];
      navigate(
        ROUTERS.USER.CHAPTERDETAIL.replace(":id", id).replace(
          ":chapterId",
          prevChapter.id
        )
      );
    }
  };

  const handleNextChapter = () => {
    if (chapterIndex < book.chapters.length - 1) {
      const nextChapter = book.chapters[chapterIndex + 1];
      navigate(
        ROUTERS.USER.CHAPTERDETAIL.replace(":id", id).replace(
          ":chapterId",
          nextChapter.id
        )
      );
    }
  };

  if (!currentChapter) return <p>Loading chapter content...</p>;

  return (
    <div className="chapter-navigation">
      <button
        onClick={handlePrevChapter}
        disabled={chapterIndex === 0}
        className="nav-button prev-button"
      >
        ←
      </button>
      <input
        className="chapter-input"
        type="text"
        value={currentChapter.title}
        readOnly
      />
      <button
        onClick={handleNextChapter}
        disabled={chapterIndex === book.chapters.length - 1}
        className="nav-button next-button"
      >
        →
      </button>
    </div>
  );
};

export default memo(NavigationChapter);
