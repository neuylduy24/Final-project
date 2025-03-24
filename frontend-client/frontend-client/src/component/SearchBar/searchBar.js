import { useState, useEffect } from "react";
import { FaPhone } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../pages/user/theme/header/style.scss";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.it-ebook.io.vn/api/books/title/${encodeURIComponent(
            query
          )}`
        );
        console.log("API Response:", response.data);
        setResults(
          Array.isArray(response.data) ? response.data : [response.data]
        );
      } catch (error) {
        console.error("Error fetching search results", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="col-lg-9 col-sm-12 col-xs-12 col-md-12 hero-search-container">
      <div className="hero-search">
        <div className="hero-search-form">
          <input
            type="text"
            placeholder="What are you looking for?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </div>

        {query.trim() && (
          <div className="hero-search-results">
            {loading ? (
              <p>Loading...</p>
            ) : results.length > 0 ? (
              <ul>
                {results.map((book) => (
                  <li
                    key={book.id}
                    onClick={() => navigate(`/books/${book.id}`)}
                  >
                    {book.title}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No results found</p>
            )}
          </div>
        )}

        <div className="hero-search-phone">
          <div className="hero-search-phone-icon">
            <FaPhone />
          </div>
          <div className="hero-search-phone-text">
            <p>0987.654.321</p>
            <span>Hotline 24/7</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
