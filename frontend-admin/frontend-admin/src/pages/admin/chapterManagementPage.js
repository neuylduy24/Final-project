import React, { useState, useEffect } from "react";
import { getAllChapters, getChaptersByBookId, deleteChapter } from "../../service/chapterService";
import { getAllBooks } from "../../service/bookService";
import ChapterForm from "../../component/Chapter/ChapterForm";
import ChapterTable from "../../component/Chapter/ChapterTable";
import Pagination from "../../component/common/Pagination";
import { toast } from "react-toastify";

const ChapterManagementPage = () => {
  const [chapters, setChapters] = useState([]);
  const [books, setBooks] = useState([]);
  const [bookTitles, setBookTitles] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState('');
  
  const [chapter, setChapter] = useState({
    id: "",
    bookId: "",
    chapterNumber: "",
    title: "",
    content: "",
    images: []
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Lấy danh sách chương
  useEffect(() => {
    fetchData();
  }, [selectedBookId]);

  // Lấy danh sách sách
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      let data;
      
      if (selectedBookId) {
        data = await getChaptersByBookId(selectedBookId);
      } else {
        data = await getAllChapters();
      }
      
      // Cập nhật danh sách chương với tên sách
      const chaptersWithBookInfo = data.map(chapter => ({
        ...chapter, 
        bookTitle: bookTitles[chapter.bookId] || "Chưa xác định"
      }));
      
      setChapters(chaptersWithBookInfo);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách chương:", error);
      toast.error("Không thể lấy danh sách chương");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      const data = await getAllBooks();
      setBooks(data);
      
      // Tạo map từ bookId đến title
      const bookTitlesMap = {};
      data.forEach(book => {
        bookTitlesMap[book.id] = book.title;
      });
      setBookTitles(bookTitlesMap);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sách:", error);
      toast.error("Không thể lấy danh sách sách");
    }
  };

  const handleAddNew = () => {
    setChapter({
      id: "",
      bookId: selectedBookId || "",
      chapterNumber: "",
      title: "",
      content: "",
      images: []
    });
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEdit = (chapterData) => {
    setChapter(chapterData);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa chương này không?")) {
      try {
        await deleteChapter(id);
        toast.success("Xóa chương thành công");
        fetchData(); // Tải lại dữ liệu sau khi xóa
      } catch (error) {
        console.error("Lỗi khi xóa chương:", error);
        toast.error("Không thể xóa chương");
      }
    }
  };

  const handleFilterByBook = (e) => {
    setSelectedBookId(e.target.value);
    setCurrentPage(1);
  };

  // Phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = chapters.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(chapters.length / itemsPerPage);

  return (
    <div className="container">
      <div className="container-page">
        <h2>Quản lý chương</h2>
        
        <div className="filter-container">
          <label htmlFor="bookFilter">Lọc theo sách:</label>
          <select 
            id="bookFilter" 
            value={selectedBookId} 
            onChange={handleFilterByBook}
          >
            <option value="">Tất cả sách</option>
            {books.map(book => (
              <option key={book.id} value={book.id}>{book.title}</option>
            ))}
          </select>
          
          <button onClick={fetchData} className="refresh-button">
            Làm mới
          </button>
        </div>

        {showForm && (
          <ChapterForm 
            chapter={chapter} 
            setChapter={setChapter} 
            onSuccess={fetchData} 
            closeForm={() => setShowForm(false)} 
            isEditing={isEditing} 
          />
        )}
        
        <ChapterTable 
          chapters={currentItems} 
          handleEdit={handleEdit} 
          handleDelete={handleDelete} 
          onAddNew={handleAddNew}
          isLoading={isLoading}
        />
        
        {!isLoading && totalPages > 1 && (
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
