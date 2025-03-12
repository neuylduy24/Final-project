import React, { useState } from "react";
import UserForm from "../../component/User/UserForm";
import UserTable from "../../component/User/UserTable";
import Pagination from "../../component/common/Pagination";
const UserManagementAdPage = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "Nguyễn Văn A", email: "a@gmail.com", role: "Admin", password: "123456", createdAt: "2024-01-15" },
    { id: 2, name: "Trần Thị B", email: "b@gmail.com", role: "User", password: "abcdef", createdAt: "2024-02-10" },
    { id: 3, name: "Nguyễn Văn C", email: "c@gmail.com", role: "User", password: "xyz789", createdAt: "2024-03-05" }
  ]);
  
  const [form, setForm] = useState({ id: "", name: "", email: "", role: "", password: "", createdAt: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 4;

  const handleInputChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      setUsers(users.map((user) => (user.id === form.id ? form : user)));
    } else {
      setUsers([...users, { ...form, id: Date.now(), createdAt: new Date().toISOString().split("T")[0] }]);
    }
    setForm({ id: "", name: "", email: "", role: "", password: "", createdAt: "" });
    setIsEditing(false);
    setShowForm(false);
  };

  const handleEdit = (user) => {
    setForm(user);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = (id) => setUsers(users.filter((user) => user.id !== id));

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  return (
    <div className="container">
      <div className="container-management">
        <h2>Quản lý người dùng</h2>

        {showForm && <UserForm form={form} setForm={setForm} handleInputChange={handleInputChange} handleSubmit={handleSubmit} setShowForm={setShowForm} isEditing={isEditing} />}

        <UserTable users={currentUsers} handleEdit={handleEdit} handleDelete={handleDelete} setShowForm={setShowForm} setForm={setForm} setIsEditing={setIsEditing} />

        <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
      </div>
    </div>
  );
};

export default UserManagementAdPage;
