import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../ProfileUserPage/ProfileUserPage.scss";
import axios from "axios";
import BookCard from "../../../component/Book/Card/bookDetailCard"; // Import the BookCard component for displaying results

const SearchPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query"); // Get the 'query' parameter from the URL

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return;

      setLoading(true);
      setError(null);

      try {
        const [booksRes, chaptersRes] = await Promise.all([
          axios.get("https://api.it-ebook.io.vn/api/books"),
          axios.get("https://api.it-ebook.io.vn/api/chapters"),
        ]);

        const books = booksRes.data;
        const chapters = chaptersRes.data;

        const lowerQuery = query.toLowerCase();

        // Tìm theo sách: title + description
        const bookMatches = books.filter(
          (book) =>
            book.title.toLowerCase().includes(lowerQuery) ||
            (book.description &&
              book.description.toLowerCase().includes(lowerQuery))
        );

        // Tìm theo content chapter
        const matchedBookIdsFromChapters = new Set(
          chapters
            .filter((chapter) =>
              chapter.content?.toLowerCase().includes(lowerQuery)
            )
            .map((chapter) => chapter.bookId)
        );

        // Ghép lại danh sách book từ title, description, hoặc từ content chapter
        const combinedResults = books.filter(
          (book) =>
            bookMatches.includes(book) ||
            matchedBookIdsFromChapters.has(book.id)
        );

        setResults(combinedResults);
      } catch (err) {
        setError("Error fetching search results. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="profile-page">
      <div className="profile-content">
        <h3>Search results: " {query}"</h3>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : results.length > 0 ? (
          <div className="book-list">
            {results.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <p className="result-search">No results found for "{query}"</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
