import React, { useState } from "react";
import "./style.scss";
import { FaArrowLeftLong, FaArrowRightLong} from "react-icons/fa6";

const UserManagementAdPage = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "Nguyễn Văn A", email: "a@gmail.com", role: "Admin", avatar: "", createdAt: "2024-01-15" },
    { id: 2, name: "Trần Thị B", email: "b@gmail.com", role: "User", avatar: "", createdAt: "2024-02-10" },
    { id: 3, name: "Nguyễn Văn A", email: "a@gmail.com", role: "Admin", avatar: "", createdAt: "2024-01-15" },
    { id: 4, name: "Trần Thị B", email: "b@gmail.com", role: "User", avatar: "", createdAt: "2024-02-10" },
    { id: 5, name: "Nguyễn Văn A", email: "a@gmail.com", role: "Admin", avatar: "", createdAt: "2024-01-15" },
    { id: 6, name: "Trần Thị B", email: "b@gmail.com", role: "User", avatar: "", createdAt: "2024-02-10" },
  ]);
  const [form, setForm] = useState({ id: "", name: "", email: "", role: "", avatar: "", createdAt: "" });
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
    setForm({ id: "", name: "", email: "", role: "", avatar: "", createdAt: "" });
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
      <div className="users">
        <h2>Quản lý người dùng</h2>

        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <form onSubmit={handleSubmit} className="user-form">
                <h3>{isEditing ? "Cập nhật người dùng" : "Thêm mới người dùng"}</h3>
                <input name="name" placeholder="Tên người dùng" value={form.name} onChange={handleInputChange} required />
                <input name="email" placeholder="Email" value={form.email} onChange={handleInputChange} required />
                <select name="role" value={form.role} onChange={handleInputChange} required>
                  <option value="">Chọn vai trò</option>
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </select>
                <input name="avatar" placeholder="Avatar URL" value={form.avatar} onChange={handleInputChange} required />
                <button type="submit">{isEditing ? "Cập nhật" : "Thêm mới"}</button>
                <button type="button" onClick={() => setShowForm(false)}>Hủy</button>
              </form>

            </div>
          </div>
        )}


        <div className="users_content">
          <table className="users_table">
            <thead>
              <tr className="users-title">
                <th>Id</th>
                <th>Tên người dùng</th>
                <th>Email</th>
                <th>Role</th>
                <th>Avatar</th>
                <th>Ngày tạo</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td><img src={user.avatar} alt="avatar" width="40" /></td>
                  <td>{user.createdAt}</td>
                  <td className="button-group">
                    <button className="add-user-button" onClick={() => {
                      setShowForm(true);
                      setForm({ id: "", name: "", email: "", role: "", avatar: "", createdAt: "" });
                      setIsEditing(false);
                    }}>Thêm
                    </button>
                    <button className="edit-user-button" onClick={() => handleEdit(user)}>Sửa</button>
                    <button className="delete-user-button" onClick={() => handleDelete(user.id)}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="users_footer">
          <div className="users_pagination">
            <button className="users-page-button" onClick={handlePrevPage} disabled={currentPage === 1}><FaArrowLeftLong /></button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button key={index + 1} className={`users-page-button ${currentPage === index + 1 ? "users-page-button-active" : ""}`} onClick={() => setCurrentPage(index + 1)}>
                {index + 1}
              </button>
            ))}
            <button className="users-page-button" onClick={handleNextPage} disabled={currentPage === totalPages}><FaArrowRightLong /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagementAdPage;
