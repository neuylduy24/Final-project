import React, { useState, useEffect } from "react";
import ChapterForm from "../../component/Chapter/ChapterForm";
import ChapterTable from "../../component/Chapter/ChapterTable";
import Pagination from "../../component/common/Pagination";
import bookService from "../../service/bookService";
import chapterService from "../../service/chapterService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/chapterManagement.scss";

const ChapterManagementPage = () => {
  const [books, setBooks] = useState([]);
  const [bookMap, setBookMap] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedBookId, setSelectedBookId] = useState("all");
  const [form, setForm] = useState({
    bookId: "",
    chapterNumber: "",
    title: "",
    content: "",
    images: [],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [chapters, setChapters] = useState([]);
  const itemsPerPage = 4;
  // Filter chapters theo selected book
  const filteredChapters =
    selectedBookId === "all"
      ? chapters
      : chapters.filter((ch) => ch.bookId === selectedBookId);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentChapters = filteredChapters.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredChapters.length / itemsPerPage);

  // Fetch books and chapters on component mount
  useEffect(() => {
    fetchBooks();
    fetchChapters();
  }, []);

  // Create a map of book IDs to book titles for easy lookup
  useEffect(() => {
    const map = {};
    books.forEach((book) => {
      map[book.id] = book.title;
    });
    setBookMap(map);
  }, [books]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await bookService.getAllBooks();
      setBooks(data);
      setError(null);
    } catch (err) {
      setError("Unable to load book list. Please try again later.");
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchChapters = async () => {
    try {
      setLoading(true);
      const data = await chapterService.getAllChapters();
      // Make sure data is an array before setting it to state
      const formattedData = Array.isArray(data)
        ? data.map((chapter) => {
            // Ensure each chapter has a valid createdAt date
            if (!chapter.createdAt) {
              // Set current date if createdAt is missing
              chapter.createdAt = new Date().toISOString();
            }
            return chapter;
          })
        : [];

      setChapters(formattedData);
      setError(null);
    } catch (err) {
      setError("Unable to load chapters. Please try again later.");
      console.error("Error fetching chapters:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e, success) => {
    if (success) {
      // Refresh chapters list
      fetchChapters();
      // Reset form
      setForm({
        bookId: "",
        chapterNumber: "",
        title: "",
        content: "",
        images: [],
      });
      setIsEditing(false);
      setShowForm(false);
    }
  };

  const handleEdit = (chapter) => {
    setForm(chapter);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (chapterId) => {
    try {
      await chapterService.deleteChapter(chapterId);
      fetchChapters();
    } catch (err) {
      toast.error(
        "Unable to delete chapter: " + (err.message || "Unknown error"),
        {
          toastId: `error-${Date.now()}`,
        }
      );
      console.error("Error deleting chapter:", err);
    }
  };

  const handleFilterChange = (e) => {
    setSelectedBookId(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  if (loading && books.length === 0 && chapters.length === 0) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        closeOnClick={false}
        pauseOnHover={true}
        draggable={true}
      />
      <div className="container-management">
        <h2>Chapter Management</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="filter-container">
          <label htmlFor="bookFilter">Filter by book:</label>
          <select
            id="bookFilter"
            value={selectedBookId}
            onChange={handleFilterChange}
            className="book-filter"
          >
            <option value="all">All books</option>
            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title}
              </option>
            ))}
          </select>
          <button
            className="btn-add"
            onClick={() => {
              setForm({
                bookId: selectedBookId !== "all" ? selectedBookId : "",
                chapterNumber: "",
                title: "",
                content: "",
                images: [],
              });
              setIsEditing(false);
              setShowForm(true);
            }}
          >
            Add new chapter
          </button>
        </div>

        {showForm && (
          <ChapterForm
            form={form}
            setForm={setForm}
            handleSubmit={handleSubmit}
            closeForm={() => setShowForm(false)}
            isEditing={isEditing}
            books={books}
          />
        )}

        <ChapterTable
          chapters={currentChapters}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          setShowForm={setShowForm}
          selectedBookId={selectedBookId}
          bookMap={bookMap}
        />

        {chapters.length > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default ChapterManagementPage;
