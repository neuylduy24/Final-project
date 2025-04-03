import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./search.scss";
import { FaPhone } from "react-icons/fa6";
import BookCard from "../../Book/Card/bookDetailCard"; // Import BookCard
import { ROUTERS } from "utils/path";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false); // Track search state
  const searchBarRef = useRef(null); // Reference to the SearchBar container
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchAllBooks = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://api.it-ebook.io.vn/api/books"
        );
        setAllBooks(response.data);
      } catch (error) {
        console.error("Error fetching books", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllBooks();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    // Filter books based on title, description, and chapters
    const filteredResults = allBooks.filter((book) => {
      // Check if book title or description matches the query
      const isBookMatch =
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        (book.description &&
          book.description.toLowerCase().includes(query.toLowerCase()));

      // Check if any chapter title or description matches the query
      const isChapterMatch =
        book.chapters &&
        book.chapters.some(
          (chapter) =>
            chapter.title.toLowerCase().includes(query.toLowerCase()) ||
            (chapter.description &&
              chapter.description.toLowerCase().includes(query.toLowerCase()))
        );

      // Return books that match either title/description or any chapter's title/description
      return isBookMatch || isChapterMatch;
    });

    setResults(filteredResults);
  }, [query, allBooks]);

  const handleSearch = () => {
    if (query.trim()) {
      navigate(ROUTERS.USER.SEARCHBOOK + `?query=${query}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
      setResults([]);
      setIsSearching(false); // Hide search results
    }
  };

  const handleBookClick = (bookId) => {
    navigate(`${ROUTERS.USER.BOOKDETAIL.replace(":id", bookId)}`);
    setResults([]);
    setIsSearching(false); // Hide search results
  };

  useEffect(() => {
    const handleMouseDownOutside = (event) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target)
      ) {
        setResults([]);
        setIsSearching(false); // Hide search results
      }
    };

    document.addEventListener("mousedown", handleMouseDownOutside);

    return () => {
      document.removeEventListener("mousedown", handleMouseDownOutside);
    };
  }, []);

  return (
    <div
      ref={searchBarRef}
      className="col-lg-9 col-sm-12 col-xs-12 col-md-12 hero-search-container"
    >
      <div className="hero-search-form">
        <input
          type="text"
          placeholder="Search books..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsSearching(true); // Enable search results
          }}
          onKeyDown={handleKeyPress}
        />
        <button type="button" onClick={handleSearch}>
          Search
        </button>
      </div>

      {isSearching && query.trim() && (
        <div className="hero-search-results">
          {loading ? (
            <p>Loading...</p>
          ) : results.length > 0 ? (
            <div className="search-results-grid">
              {results.map((book) => (
                <div
                  key={book.id}
                  onClick={() => handleBookClick(book.bookId || book.id)}
                >
                  <BookCard book={book} />
                </div>
              ))}
            </div>
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
  );
};

export default SearchBar;
