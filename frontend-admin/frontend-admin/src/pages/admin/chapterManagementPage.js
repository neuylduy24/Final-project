import React, { useState } from "react";
import ChapterForm from "../../component/Chapter/ChapterForm";
import ChapterTable from "../../component/Chapter/ChapterTable";
import Pagination from "../../component/common/Pagination";

const ChapterManagementPage = () => {
  const [chapters, setChapters] = useState([
    { id: 1, name: "Chương 1", title: "Tiêu đề 1", createdAt: "2024-01-15" },
    { id: 2, name: "Chương 2", title: "Tiêu đề 2", createdAt: "2024-01-16" },
    { id: 3, name: "Chương 3", title: "Tiêu đề 3", createdAt: "2024-01-17" },
    { id: 4, name: "Chương 4", title: "Tiêu đề 4", createdAt: "2024-01-18" },
    { id: 5, name: "Chương 5", title: "Tiêu đề 5", createdAt: "2024-01-19" },
    { id: 6, name: "Chương 6", title: "Tiêu đề 6", createdAt: "2024-01-20" },
  ]);

  const [form, setForm] = useState({ id: "", name: "", title: "", createdAt: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      setChapters(chapters.map((ch) => (ch.id === form.id ? { ...form } : ch)));
    } else {
      setChapters([...chapters, { ...form, id: Date.now(), createdAt: new Date().toISOString().split("T")[0] }]);
    }
    setForm({ id: "", name: "", title: "", createdAt: "" });
    setIsEditing(false);
    setShowForm(false);
  };

  const handleEdit = (chapter) => {
    setForm(chapter);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setChapters(chapters.filter((ch) => ch.id !== id));
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = chapters.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(chapters.length / itemsPerPage);

  return (
    <div className="container">
      <div className="container-management">
        <h2>Quản lý chương</h2>

        {showForm && <ChapterForm form={form} setForm={setForm} handleSubmit={handleSubmit} closeForm={() => setShowForm(false)} isEditing={isEditing} />}
        
        <ChapterTable chapters={currentItems} handleEdit={handleEdit} handleDelete={handleDelete} setShowForm={setShowForm} />
        
        <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
      </div>
    </div>
  );
};

export default ChapterManagementPage;
