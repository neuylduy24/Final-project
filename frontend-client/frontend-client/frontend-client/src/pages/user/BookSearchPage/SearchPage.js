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
      if (!query) return; // If no query, don't fetch anything

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          "https://api.it-ebook.io.vn/api/books"
        );
        const books = response.data;

        // Filter books based on query (searching in title and description)
        const filteredResults = books.filter(
          (book) =>
            book.title.toLowerCase().includes(query.toLowerCase()) ||
            (book.description &&
              book.description.toLowerCase().includes(query.toLowerCase()))
        );

        setResults(filteredResults);
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
          <p>No results found for "{query}"</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
