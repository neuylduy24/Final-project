import React, { useState } from "react";
import "./style.scss";
import { FaArrowLeftLong, FaArrowRightLong,} from "react-icons/fa6";

const CategoriesManagementAdPage = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "Tình cảm", createdAt: "2024-01-15" },
    { id: 2, name: "Tình cảm", createdAt: "2024-01-15" },
    { id: 3, name: "Tình cảm", createdAt: "2024-01-15" },
    { id: 4, name: "Tình cảm", createdAt: "2024-01-15" },
    { id: 5, name: "Tình cảm", createdAt: "2024-01-15" },
    { id: 6, name: "Tình cảm", createdAt: "2024-01-15" },
  ]);
  const [form, setForm] = useState({ id: "", name: "", createdAt: "" });
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
      setUsers(users.map((user) => (user.id === form.id ? form : user)));
    } else {
      setUsers([...users, { ...form, id: Date.now(), createdAt: new Date().toISOString().split("T")[0] }]);
    }
    setForm({ id: "", name: "", createdAt: "" });
    setIsEditing(false);
    setShowForm(false);
  };

  const handleEdit = (user) => {
    setForm(user);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(users.length / usersPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="container">
      <div className="categories">
        <h2>Quản lý thể loại</h2>

        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <form onSubmit={handleSubmit} className="categories-form">
                <h3>{isEditing ? "Cập nhật thể loại" : "Thêm mới thể loại"}</h3>
                <input name="name" placeholder="Tên thể loại" value={form.name} onChange={handleInputChange} required />
                {/* <select name="role" value={form.role} onChange={handleInputChange} required>
                  <option value="">Chọn thể loại</option>
                  <option value="Admin">Truyện</option>
                  <option value="User">Sách giáo khoa</option>
                </select> */}
                <button type="submit">{isEditing ? "Cập nhật" : "Thêm mới"}</button>
                <button type="button" onClick={() => setShowForm(false)}>Hủy</button>
              </form>
            </div>
          </div>
        )}


        <div className="categories_content">
          <table className="categories_table">
            <thead>
              <tr className="categories-title">
                <th>Id</th>
                <th>Tên thể loại</th>
                <th>Ngày tạo</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.createdAt}</td>
                  <td className="button-group">
                    <button className="add-categories-button" onClick={() => {
                      setShowForm(true);
                      setForm({ id: "", name: "",createdAt: "" });
                      setIsEditing(false);
                    }}>Thêm
                    </button>
                    <button className="edit-categories-button" onClick={() => handleEdit(user)}>Sửa</button>
                    <button className="delete-categories-button" onClick={() => handleDelete(user.id)}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="categories_footer">
          <div className="categories_pagination">
            <button className="categories-page-button" onClick={handlePrevPage} disabled={currentPage === 1}><FaArrowLeftLong /></button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button key={index + 1} className={`categories-page-button ${currentPage === index + 1 ? "categories-page-button-active" : ""}`} onClick={() => setCurrentPage(index + 1)}>
                {index + 1}
              </button>
            ))}
            <button className="categories-page-button" onClick={handleNextPage} disabled={currentPage === totalPages}><FaArrowRightLong /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesManagementAdPage;
