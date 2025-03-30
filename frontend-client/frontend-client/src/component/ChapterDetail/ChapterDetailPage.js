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

  // Fetch book data
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

  // Find previous and next chapter IDs
  const findAdjacentChapters = useCallback(() => {
    if (!chapterList || chapterList.length === 0) return { prev: null, next: null };
    
    const currentIndex = chapterList.findIndex(ch => ch.id === chapterId);
    if (currentIndex === -1) return { prev: null, next: null };
    
    return {
      prev: currentIndex > 0 ? chapterList[currentIndex - 1].id : null,
      next: currentIndex < chapterList.length - 1 ? chapterList[currentIndex + 1].id : null
    };
  }, [chapterId, chapterList]);

  const { prev, next } = findAdjacentChapters();

  if (loading) return <p>Loading chapter content...</p>;
  if (!currentChapter) return <p>Chapter not found!</p>;

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
      
      {/* Display chapter content */}
      <div className="chapter-content" dangerouslySetInnerHTML={{ __html: currentChapter.content }}></div>
      
      <div className="chapter-navigation">
        <button 
          className="nav-button prev-button" 
          disabled={!prev}
          onClick={() => prev && navigate(
            ROUTERS.USER.CHAPTERDETAIL.replace(":id", id).replace(":chapterId", prev)
          )}
        >
          Previous Chapter
        </button>
        
        <button 
          className="nav-button next-button" 
          disabled={!next}
          onClick={() => next && navigate(
            ROUTERS.USER.CHAPTERDETAIL.replace(":id", id).replace(":chapterId", next)
          )}
        >
          Next Chapter
        </button>
      </div>
      
      <Comment />
    </div>
  );
};

export default memo(ChapterDetail);
