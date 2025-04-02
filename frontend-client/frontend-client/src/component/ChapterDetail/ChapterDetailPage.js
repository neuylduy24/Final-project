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
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

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

  const fetchChapters = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://api.it-ebook.io.vn/api/chapters?bookId=${id}`
      );
      const filteredChapters = response.data.filter(
        (chapter) => chapter.bookId === id
      );
      setChapterList(filteredChapters);
    } catch (error) {
      console.error("Error fetching chapters:", error);
    }
  }, [id]);

  const fetchChapterContent = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.it-ebook.io.vn/api/chapters/${chapterId}`
      );
      setCurrentChapter(response.data);
    } catch (error) {
      console.error("Error fetching chapter content:", error);
    } finally {
      setLoading(false);
    }
  }, [chapterId]);

  const fetchComments = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://api.it-ebook.io.vn/api/feedbacks/comments/${chapterId}`
      );
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }, [chapterId]);

  useEffect(() => {
    fetchBookData();
    fetchChapters();
    fetchChapterContent();
    fetchComments();
  }, [fetchBookData, fetchChapters, fetchChapterContent, fetchComments]);

  const handleCommentAdded = (newComment) => {
    setComments((prevComments) => [newComment, ...prevComments]);
  };

  const emailColors = [
    "#ff5733",
    "#33ff57",
    "#3357ff",
    "#ff33a1",
    "#f39c12",
    "#18a6be",
    "#24e948",
  ];
  const getRandomColor = () =>
    emailColors[Math.floor(Math.random() * emailColors.length)];

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
        {/* Display chapter images if available */}
        {currentChapter.images && currentChapter.images.length > 0 && (
          <div className="chapter-images">
            {currentChapter.images.map((imageUrl, index) => (
              <img 
                key={index} 
                src={imageUrl} 
                alt={`${currentChapter.title} - Image ${index + 1}`} 
                className="chapter-image"
              />
            ))}
          </div>
        )}
        
        {/* Display chapter text content */}
        {currentChapter.content?.split("\n").map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      <NavigationChapter chapterList={chapterList} />
      <Comment
        bookId={chapterId}
        token={token}
        onCommentAdded={handleCommentAdded}
      />

      {/* ✅ Hiển thị danh sách comments */}
      <div className="comment-section">
        <h3 className="comment-title">All Comments</h3>
        {comments.length === 0 ? (
          <p className="no-comments">No comments yet.</p>
        ) : (
          <ul className="comment-list">
            {comments.map((comment) => (
              <li key={comment.id} className="comment-item">
                <div className="comment-header">
                  <h3 className="email" style={{ color: getRandomColor() }}>
                    {comment.userId}
                  </h3>
                  <span className="chapter-title">{currentChapter.title}</span>
                </div>
                <p className="comment-content">{comment.content}</p>
                <small className="comment-date">
                  {new Date(comment.createdAt).toLocaleString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default memo(ChapterDetail);
