import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./search.scss";
import { FaPhone } from "react-icons/fa6";
import BookCard from "../../Book/Card/bookDetailCard";
import { ROUTERS } from "utils/path";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [allChapters, setAllChapters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchBarRef = useRef(null);
  const [showResultGrid, setShowResultGrid] = useState(true);
  const navigate = useNavigate();

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
    const fetchAllChapters = async () => {
      try {
        const response = await axios.get(
          "https://api.it-ebook.io.vn/api/chapters"
        );
        setAllChapters(response.data);
      } catch (error) {
        console.error("Error fetching chapters", error);
      }
    };

    fetchAllChapters();
  }, []);
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();

    const filteredBooks = allBooks.filter((book) => {
      const isBookMatch =
        book.title.toLowerCase().includes(lowerQuery) ||
        (book.description &&
          book.description.toLowerCase().includes(lowerQuery));

      // Lọc tất cả chapters thuộc book đó
      const chaptersOfBook = allChapters.filter(
        (chap) => chap.bookId === book.id
      );

      const matchedChapter = chaptersOfBook.find(
        (chap) =>
          chap.title?.toLowerCase().includes(lowerQuery) ||
          chap.description?.toLowerCase().includes(lowerQuery) ||
          chap.content?.toLowerCase().includes(lowerQuery)
      );

      if (matchedChapter) {
        book.matchedChapterSnippet = matchedChapter.content
          ?.split("\n")
          .find((p) => p.toLowerCase().includes(lowerQuery));
      }

      return isBookMatch || !!matchedChapter;
    });

    setResults(filteredBooks);
  }, [query, allBooks, allChapters]);

  const handleSearch = () => {
    if (query.trim()) {
      setShowResultGrid(false); // Ẩn khi nhấn nút
      navigate(ROUTERS.USER.SEARCHBOOK + `?query=${query}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setShowResultGrid(false); // Ẩn khi nhấn Enter
      handleSearch();
    }
  };

  const handleBookClick = (bookId) => {
    navigate(`${ROUTERS.USER.BOOKDETAIL.replace(":id", bookId)}`);
    setResults([]);
    setIsSearching(false);
  };

  useEffect(() => {
    const handleMouseDownOutside = (event) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target)
      ) {
        setResults([]);
        setIsSearching(false);
      }
    };

    document.addEventListener("mousedown", handleMouseDownOutside);
    return () =>
      document.removeEventListener("mousedown", handleMouseDownOutside);
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
            setIsSearching(true);
            setShowResultGrid(true); // Gõ là hiện lại
          }}
          onKeyDown={handleKeyPress}
        />
        <button type="button" onClick={handleSearch}>
          Search
        </button>
      </div>

      {isSearching && query.trim() && showResultGrid && (
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
                  <BookCard
                    book={book}
                    onChapterClick={() => {
                      setResults([]);
                      setIsSearching(false);
                    }}
                  />
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
