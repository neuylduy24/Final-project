import React, { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "../../../component/Book/Card/bookDetailCard"; // Component hiển thị từng cuốn sách
// import "./sortedBookList.scss"; // (tuỳ chọn)

const SortedBookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSortedBooks = async () => {
      try {
        const response = await axios.get(
          "https://api.it-ebook.io.vn/api/books/sorted/by-date-desc"
        );
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching sorted books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSortedBooks();
  }, []);

  return (
    <div className="sorted-book-list container mt-4">
      <h2 className="mb-4">📚 New book update</h2>
      {loading ? (
        <p>Đang tải sách...</p>
      ) : books.length > 0 ? (
        <div className="row">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <p>Không có sách nào.</p>
      )}
    </div>
  );
};

export default SortedBookList;
