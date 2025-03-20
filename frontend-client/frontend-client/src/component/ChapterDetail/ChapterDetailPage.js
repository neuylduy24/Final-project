import { useEffect, useState, memo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./chapterDetail.scss";
import { ROUTERS } from "utils/path";
import NavigationChapter from "component/NavigationChapter/NavigationChapter";
import Comment from "component/Comment/comment";

const ChapterDetail = () => {
  const { id, chapterId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBookData = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://api.it-ebook.io.vn/api/books/${id}`
      );
      const bookData = response.data;

      if (!bookData || !bookData.chapters || bookData.chapters.length === 0) {
        console.error("There are no chapters in this book..");
        setLoading(false);
        return;
      }

      setBook(bookData);

      const foundIndex = bookData.chapters.findIndex(
        (ch) => ch.id === chapterId
      );
      if (foundIndex === -1) {
        console.warn("Chapter not found, navigate to first chapter.");
        navigate(
          ROUTERS.USER.CHAPTERDETAIL.replace(":id", id).replace(
            ":chapterId",
            bookData.chapters[0].id
          ),
          {
            replace: true,
          }
        );
        return;
      }

      setCurrentChapter(bookData.chapters[foundIndex]);
    } catch (error) {
      console.error("Error fetching book data:", error);
    } finally {
      setLoading(false);
    }
  }, [id, chapterId, navigate]);

  useEffect(() => {
    fetchBookData();
  }, [fetchBookData]);

  if (loading) return <p>Loading chapter content...</p>;
  if (!currentChapter) return <p>Chapter not found!!!</p>;

  return (
    <div className="chapter-detail">
      {book && <h1>{book.title}</h1>}
      <h2>{currentChapter.title}</h2>
      <div className="chapter-dropdown">
        <select
          className="chapter-select"
          value={chapterId}
          onChange={(e) =>
            navigate(
              ROUTERS.USER.CHAPTERDETAIL.replace(":id", id).replace(
                ":chapterId",
                e.target.value
              )
            )
          }
        >
          {book?.chapters?.map((chapter) => (
            <option key={chapter.id} value={chapter.id}>
              {chapter.title}
            </option>
          ))}
        </select>
      </div>
      <div className="chapter-content">{currentChapter.content}</div>
      <Comment />
      <NavigationChapter />
    </div>
  );
};

export default memo(ChapterDetail);
