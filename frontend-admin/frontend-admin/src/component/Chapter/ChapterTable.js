import React, { useEffect, useState, useMemo } from "react";
import { FaSearch } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { removeAccents } from "../../utils/helper";

const ChapterTable = ({
  chapters,
  handleEdit,
  handleDelete,
  setShowForm,
  selectedBookId,
  bookMap,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredChapters, setFilteredChapters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Update filtered chapters
  useEffect(() => {
    let filtered = chapters;

    if (selectedBookId && selectedBookId !== "all") {
      filtered = filtered.filter((chapter) => chapter.bookId === selectedBookId);
    }

    const normalizedSearchTerm = removeAccents(searchTerm.toLowerCase());

    if (normalizedSearchTerm) {
      filtered = filtered.filter(
        (chapter) =>
          removeAccents((chapter.title || "").toLowerCase()).includes(normalizedSearchTerm) ||
          removeAccents((chapter.content || "").toLowerCase()).includes(normalizedSearchTerm) ||
          removeAccents((bookMap[chapter.bookId] || "").toLowerCase()).includes(normalizedSearchTerm)
      );
    }

    setFilteredChapters(filtered);
    setCurrentPage(1); // luôn reset về trang 1 sau mỗi lần lọc
  }, [chapters, selectedBookId, searchTerm, bookMap]);

  // Tính currentChapters dựa trên currentPage
  const currentChapters = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredChapters.slice(start, end);
  }, [filteredChapters, currentPage]);

  const totalPages = Math.ceil(filteredChapters.length / itemsPerPage);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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

  const handleDeleteClick = (chapterId) => {
    handleDelete(chapterId);
  };

  return (
    <div>
      <div className="search-container">
        <FaSearch className="search-icon" />
        <input
          className="search-input"
          type="text"
          placeholder="Search chapters..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
          {currentChapters.length > 0 ? (
            currentChapters.map((chapter) => (
              <tr key={chapter.id}>
                <td>{chapter.chapterNumber}</td>
                <td>{chapter.title || "Untitled"}</td>
                <td>{getBookTitle(chapter.bookId)}</td>
                <td>{truncateContent(chapter.content)}</td>
                <td>{formatDate(chapter.createdAt)}</td>
                <td>{chapter.views || 0}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-edit" onClick={() => handleEdit(chapter)}>
                      Edit
                    </button>
                    <button className="btn-delete" onClick={() => handleDeleteClick(chapter.id)}>
                      Delete
                    </button>
                  </div>
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ChapterTable;
