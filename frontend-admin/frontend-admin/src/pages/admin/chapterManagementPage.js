import React, { useState, useEffect, useMemo } from "react";
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
    images: [],
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

  const handleSubmit = async (e, formDataWithImages) => {
    e.preventDefault();
    
    let dataToSubmit = formDataWithImages ? formDataWithImages : { ...form };
  
    console.log("🚀 Gửi dữ liệu:", dataToSubmit);
  
    try {
      const response = await chapterService.createChapter(dataToSubmit);
      console.log("✅ API response:", response);
    } catch (err) {
      console.error("❌ Lỗi từ API:", err.response?.data || err.message);
      setError("Không thể thêm chương mới");
    }
  };
  

  const resetForm = () => {
    setForm({ bookId: "", chapterNumber: "", title: "", content: "", images: [] });
    setIsEditing(false);
    setShowForm(false);
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
        fetchChapters(); // Cập nhật danh sách sau khi xóa
      } catch (err) {
        setError("Không thể xóa chương");
        console.error("Error deleting chapter:", err);
      }
    }
  };

  // Tính toán danh sách chương được hiển thị theo trang
  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return chapters.slice(indexOfFirstItem, indexOfLastItem);
  }, [chapters, currentPage]);

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
            closeForm={resetForm}
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
