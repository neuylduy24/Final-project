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
  const removeAccents = (str) => {
    return str
      .normalize("NFD") // Tách chữ và dấu
      .replace(/[\u0300-\u036f]/g, "") // Xóa dấu
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase();
  };
  
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
  
    const normalizedQuery = removeAccents(query);
  
    const filteredBooks = allBooks.filter((book) => {
      const isBookMatch =
        removeAccents(book.title).includes(normalizedQuery) ||
        (book.description &&
          removeAccents(book.description).includes(normalizedQuery));
  
      const chaptersOfBook = allChapters.filter(
        (chap) => chap.bookId === book.id
      );
  
      const matchedChapter = chaptersOfBook.find(
        (chap) =>
          removeAccents(chap.title || "").includes(normalizedQuery) ||
          removeAccents(chap.description || "").includes(normalizedQuery) ||
          removeAccents(chap.content || "").includes(normalizedQuery)
      );
  
      if (matchedChapter) {
        book.matchedChapterSnippet = matchedChapter.content
          ?.split("\n")
          .find((p) => removeAccents(p).includes(normalizedQuery));
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
