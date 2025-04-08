import React, { useEffect, useState } from "react";
import axios from "axios";
import BookForm from "./BookForm";
import { FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookTable = ({ currentPage, booksPerPage, setCurrentPage }) => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [searchTerm, books]);

  const fetchBooks = async () => {
    try {
      const res = await axios.get("https://api.it-ebook.io.vn/api/books");
      setBooks(res.data);
    } catch (err) {
      toast.error("❌ Failed to fetch books");
    }
  };

  const removeAccents = (str) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");

  const filterBooks = () => {
    setCurrentPage(1);
    const keyword = removeAccents(searchTerm.toLowerCase());

    const filtered = books.filter((book) => {
      const titleMatch = book.title
        ? removeAccents(book.title.toLowerCase()).includes(keyword)
        : false;
      const authorMatch = book.author
        ? removeAccents(book.author.toLowerCase()).includes(keyword)
        : false;

      let categoryMatch = false;
      if (Array.isArray(book.categories)) {
        categoryMatch = book.categories.some((cat) =>
          removeAccents(cat?.name?.toLowerCase() || "").includes(keyword)
        );
      } else if (Array.isArray(book.category)) {
        categoryMatch = book.category.some((cat) =>
          removeAccents(cat?.name?.toLowerCase() || "").includes(keyword)
        );
      } else if (typeof book.category === "string") {
        categoryMatch = removeAccents(book.category.toLowerCase()).includes(
          keyword
        );
      }

      return titleMatch || authorMatch || categoryMatch;
    });

    setFilteredBooks(filtered);
  };

  const handleEdit = (book) => {
    setSelectedBook(book);
    setShowForm(true);
    setIsEditing(true);
  };

  const handleSave = async (book) => {
    try {
      let response;

      const bookData = {
        title: book.title,
        author: book.author,
        categories: book.categories || [],
        category: book.category || "",
      };
      if (book.image) {
        bookData.image = book.image; // nếu là image URL
      }
      console.log("BOOK DATA TO SEND:", bookData);

      if (isEditing) {
        response = await axios.put(
          `https://api.it-ebook.io.vn/api/books/${book.id}`,
          bookData
        );
      } else {
        bookData.createdAt = new Date().toISOString();
        response = await axios.post(
          "https://api.it-ebook.io.vn/api/books",
          bookData
        );
      }

      fetchBooks();
      toast.success("✅ Book saved successfully!");
      return response.data;
    } catch {}
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://api.it-ebook.io.vn/api/books/${id}`);
      fetchBooks();
      toast.warning("🗑️ Book deleted");
    } catch (err) {
      toast.error("❌ Failed to delete book");
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const indexOfLast = currentPage * booksPerPage;
  const indexOfFirst = indexOfLast - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirst, indexOfLast);

  return (
    <div>
      {showForm && (
        <BookForm
          book={selectedBook}
          onSave={handleSave}
          setShowForm={setShowForm}
          isEditing={isEditing}
        />
      )}

      <div className="search-container">
        <FaSearch className="search-icon" />
        <input
          className="search-input"
          type="text"
          placeholder="Search books..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="btn-add"
          onClick={() => {
            setSelectedBook(null);
            setShowForm(true);
            setIsEditing(false);
          }}
        >
          Add New Book
        </button>
      </div>

      <table className="container-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cover</th>
            <th>Title</th>
            <th>Author</th>
            <th>Categories</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentBooks.length > 0 ? (
            currentBooks.map((book) => (
              <tr key={book.id}>
                <td>{book.id}</td>
                <td>
                  {book.image ? (
                    <img
                      src={book.image}
                      alt="cover"
                      style={{
                        width: 50,
                        height: 75,
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                  ) : book.imageData ? (
                    <img
                      src={`data:image/jpeg;base64,${book.imageData}`}
                      alt="cover"
                      style={{
                        width: 50,
                        height: 75,
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                  ) : (
                    <img
                      src={`https://api.it-ebook.io.vn/api/books/${book.id}/image`}
                      alt="cover"
                      style={{
                        width: 50,
                        height: 75,
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                  )}
                </td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>
                  {book.categories
                    ? book.categories.map((cat) => cat.name).join(", ")
                    : book.category}
                </td>
                <td>{formatDate(book.createdAt)}</td>
                <td>
                  <div className="action-buttons">
                    {" "}
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(book)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(book.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                {searchTerm ? "No matching books found" : "No books available"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BookTable;
