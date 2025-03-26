    import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChapterTable = ({ 
  chapters, 
  handleEdit, 
  handleDelete, 
  setShowForm,
  selectedBookId,
  bookMap
}) => {
  const [filteredChapters, setFilteredChapters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Filter chapters based on selected book and search term
    let filtered = chapters;
    
    // Filter by book if a specific book is selected
    if (selectedBookId && selectedBookId !== "all") {
      filtered = filtered.filter(chapter => chapter.bookId === selectedBookId);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(chapter => 
        chapter.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chapter.chapterNumber?.toString().includes(searchTerm)
      );
    }
    
    setFilteredChapters(filtered);
  }, [chapters, selectedBookId, searchTerm]);

  const handleAddChapter = () => {
    setShowForm(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const truncateContent = (content, maxLength = 50) => {
    if (!content) return "No content";
    return content.length > maxLength
      ? content.substring(0, maxLength) + "..."
      : content;
  };

  const getBookTitle = (bookId) => {
    return bookMap[bookId] || "Unknown Book";
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="search-container">
        <FaSearch className="search-icon" />
        <input
          className="search-input"
          type="text"
          placeholder="Search chapters..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="add-button" onClick={handleAddChapter}>
          ➕ Add Chapter
        </button>
      </div>

      <table className="container-table">
        <thead>
          <tr>
            <th>Chapter</th>
            <th>Title</th>
            <th>Book</th>
            <th>Content Preview</th>
            <th>Created Date</th>
            <th>Views</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredChapters.length > 0 ? (
            filteredChapters.map((chapter) => (
              <tr key={chapter.id}>
                <td>{chapter.chapterNumber}</td>
                <td>{chapter.title || "Untitled"}</td>
                <td>{getBookTitle(chapter.bookId)}</td>
                <td>{truncateContent(chapter.content)}</td>
                <td>{formatDate(chapter.createdAt)}</td>
                <td>{chapter.views || 0}</td>
                <td className="button-group">
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(chapter)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(chapter.id)}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                No chapters found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ChapterTable;