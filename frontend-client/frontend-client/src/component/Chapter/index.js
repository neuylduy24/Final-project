import { memo, useEffect, useState } from 'react';
import './style.scss';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Chapter = () => {
  const { id } = useParams(); // Lấy id sách từ URL
  const [book, setBook] = useState(null);

  useEffect(() => {
    axios
      .get(`https://api.it-ebook.io.vn/api/books/${id}`)
      .then((response) => setBook(response.data))
      .catch((error) => console.error("Error taking data books:", error));
  }, [id]);

  if (!book) return <p>Loading data...</p>;

    return (
        <div className="chapter-list">
        <h3>List Chapters</h3>
        <ul className="chapter-items">
          {Array.isArray(book.chapters)
            ? book.chapters.map((chapter, index) => (
                <li key={index} className="chapter-item">
                  <a href={`/books/${book.id}/chapters/${chapter.id}`}>
                    {chapter.title}
                  </a>
                  <span className="chapter-date">{chapter.updatedAt}</span>
                </li>
              ))
            : "Not yet chater"}
        </ul>
      </div>
    );

}
export default memo(Chapter);
