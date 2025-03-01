import React, { useState } from "react";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import "./style.scss";

const ChapterManagementPageForm = () => {
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
  const usersPerPage = 4;

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = chapters.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(chapters.length / usersPerPage);

  return (
    <div className="container">
      <div className="chapter">
        <h2>Quản lý chương</h2>

        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <form onSubmit={handleSubmit} className="chapter-form">
                <h3>{isEditing ? "Cập nhật chương" : "Thêm mới chương"}</h3>
                <input name="name" placeholder="Số chương" value={form.name} onChange={handleInputChange} required />
                <input name="title" placeholder="Tiêu đề" value={form.title} onChange={handleInputChange} required />
                <button type="submit">{isEditing ? "Cập nhật" : "Thêm mới"}</button>
                <button type="button" onClick={() => setShowForm(false)}>Hủy</button>
              </form>
            </div>
          </div>
        )}
        <div className="chapter_content">
          <table className="chapter_table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Số chương</th>
                <th>Tiêu đề</th>
                <th>Ngày tạo</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map((ch) => (
                  <tr key={ch.id}>
                    <td>{ch.id}</td>
                    <td>{ch.name}</td>
                    <td>{ch.title}</td>
                    <td>{ch.createdAt}</td>
                    <td className="button-group">
                      <button className="add-chapter-button" onClick={() => {
                        setShowForm(true);
                        setForm({ id: "", name: "", title: "", createdAt: "" });
                        setIsEditing(false);
                      }}>
                        Thêm
                      </button>
                      <button className="edit-chapter-button" onClick={() => handleEdit(ch)}>Sửa</button>
                      <button className="delete-chapter-button" onClick={() => handleDelete(ch.id)}>Xóa</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>Không có chương nào</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="chapter_footer">
            <div className="chapter_pagnigation">
              <button className="chapter-page-button" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                <FaArrowLeftLong />
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  className={`chapter-page-button ${currentPage === index + 1 ? "chapter-page-button-active" : ""}`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              <button className="chapter-page-button" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                <FaArrowRightLong />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChapterManagementPageForm;
