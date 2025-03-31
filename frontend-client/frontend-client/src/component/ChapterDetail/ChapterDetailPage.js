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
  const [chapterList, setChapterList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookData = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://api.it-ebook.io.vn/api/books/${id}`
      );
      setBook(response.data);
    } catch (error) {
      console.error("Error fetching book data:", error);
    }
  }, [id]);

  // Fetch chapters list
  const fetchChapters = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://api.it-ebook.io.vn/api/chapters?bookId=${id}`
      );
      console.log("Fetched chapters for book ID:", id, response.data);
      // Filter chapters to ensure they belong to the current book
      const filteredChapters = response.data.filter(chapter => chapter.bookId === id);
      setChapterList(filteredChapters);
    } catch (error) {
      console.error("Error fetching chapters:", error);
    }
  }, [id]);

  // Fetch specific chapter content
  const fetchChapterContent = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.it-ebook.io.vn/api/chapters/${chapterId}`
      );
      console.log("Chapter content data:", response.data);
      setCurrentChapter(response.data);
    } catch (error) {
      console.error("Error fetching chapter content:", error);
    } finally {
      setLoading(false);
    }
  }, [chapterId]);

  useEffect(() => {
    fetchBookData();
    fetchChapters();
    fetchChapterContent();
  }, [fetchBookData, fetchChapters, fetchChapterContent]);

  useEffect(() => {
    fetchBookData();
  }, [fetchBookData]);

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
          {chapterList?.map((chapter) => (
            <option key={chapter.id} value={chapter.id}>
              {chapter.title}
            </option>
          ))}
        </select>
      </div>
      <div className="chapter-content">
        {currentChapter.content?.split("\n").map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      <NavigationChapter chapterList={chapterList} />
      <Comment />
    </div>
  );
};

export default memo(ChapterDetail);
