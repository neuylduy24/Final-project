import React, { useState, useEffect } from "react";
import ChapterForm from "../../component/Chapter/ChapterForm";
import ChapterTable from "../../component/Chapter/ChapterTable";
import Pagination from "../../component/common/Pagination";
import chapterService from "../../service/chapterService";
import "../../styles/chapterManagement.css";

const ChapterManagementPage = () => {
  const [chapters, setChapters] = useState([]);
  const [form, setForm] = useState({
    bookId: "",
    chapterNumber: "",
    title: "",
    content: "",
    images: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchChapters();
  }, []);

  const fetchChapters = async () => {
    try {
      setLoading(true);
      const data = await chapterService.getAllChapters();
      setChapters(data);
      setError(null);
    } catch (err) {
      setError("Không thể tải danh sách chương. Vui lòng thử lại sau.");
      console.error("Error fetching chapters:", err);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý việc tải ảnh lên từ files
  const uploadImages = async (files) => {
    try {
      // Giả lập việc upload - trong thực tế, thay thế bằng API thật
      return await chapterService.uploadImages(files);
    } catch (error) {
      console.error("Error uploading images:", error);
      throw new Error("Không thể tải ảnh lên. Vui lòng thử lại.");
    }
  };

  const handleSubmit = async (e, formDataWithImages) => {
    e.preventDefault();
    
    try {
      let dataToSubmit;
      
      // Nếu form đã có dữ liệu ảnh từ tùy chọn tải lên (formDataWithImages được truyền)
      if (formDataWithImages) {
        dataToSubmit = {
          ...formDataWithImages,
          createdAt: isEditing ? form.createdAt : new Date().toISOString()
        };
      } else {
        // Trường hợp thông thường (sử dụng URL)
        dataToSubmit = {
          ...form,
          createdAt: isEditing ? form.createdAt : new Date().toISOString()
        };
      }
      
      if (isEditing) {
        await chapterService.updateChapter(dataToSubmit.id, dataToSubmit);
        setChapters(chapters.map((ch) => (ch.id === dataToSubmit.id ? dataToSubmit : ch)));
      } else {
        const newChapter = await chapterService.createChapter(dataToSubmit);
        
        const chapterWithDate = newChapter.createdAt 
          ? newChapter 
          : { ...newChapter, createdAt: new Date().toISOString() };
        
        setChapters([...chapters, chapterWithDate]);
      }
      
      setForm({
        bookId: "",
        chapterNumber: "",
        title: "",
        content: "",
        images: []
      });
      setIsEditing(false);
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError(isEditing ? "Không thể cập nhật chương" : "Không thể thêm chương mới");
      console.error("Error submitting chapter:", err);
    }
  };

  const handleEdit = (chapter) => {
    setForm(chapter);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa chương này?")) {
      try {
        await chapterService.deleteChapter(id);
        setChapters(chapters.filter((ch) => ch.id !== id));
        setError(null);
      } catch (err) {
        setError("Không thể xóa chương");
        console.error("Error deleting chapter:", err);
      }
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = chapters.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(chapters.length / itemsPerPage);

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="container">
      <div className="container-management">
        <h2>Quản lý chương</h2>

        {error && <div className="error-message">{error}</div>}

        {showForm && (
          <ChapterForm
            form={form}
            setForm={setForm}
            handleSubmit={handleSubmit}
            closeForm={() => setShowForm(false)}
            isEditing={isEditing}
          />
        )}

        <ChapterTable
          chapters={currentItems}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          setShowForm={setShowForm}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default ChapterManagementPage;
