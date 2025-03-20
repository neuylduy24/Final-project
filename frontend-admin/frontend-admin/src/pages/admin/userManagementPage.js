import React, { useState, useEffect } from "react";
import UserForm from "../../component/User/UserForm";
import UserTable from "../../component/User/UserTable";
import Pagination from "../../component/common/Pagination";
import userService from "../../service/userService";
import "../../styles/userManagement.css";

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    roles: [],
    avatar: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const itemsPerPage = 4;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError("Không thể tải danh sách người dùng. Vui lòng thử lại sau.");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e, updatedForm) => {
    e.preventDefault();
    try {
      const formToSubmit = updatedForm || form;
      
      // Nếu không đang chỉnh sửa, đảm bảo vai trò là reader
      if (!isEditing) {
        formToSubmit.roles = [2]; // Giả sử 2 là ID của role reader, điều chỉnh nếu cần
      }
      
      if (isEditing) {
        // Khi chỉnh sửa, giữ nguyên vai trò hiện tại
        await userService.updateUser(formToSubmit.id, formToSubmit);
        setUsers(users.map((user) => (user.id === formToSubmit.id ? formToSubmit : user)));
      } else {
        const newUser = await userService.createUser(formToSubmit);
        
        // Đảm bảo có trường createdAt
        const userWithDate = newUser.createdAt 
          ? newUser 
          : { ...newUser, createdAt: new Date().toISOString() };
        
        setUsers([...users, userWithDate]);
      }
      
      setForm({
        username: "",
        email: "",
        password: "",
        roles: [],
        avatar: ""
      });
      setIsEditing(false);
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError(isEditing ? "Không thể cập nhật người dùng" : "Không thể thêm người dùng mới");
      console.error("Error submitting user:", err);
    }
  };

  const handleEdit = (user) => {
    // Chuẩn bị form cho việc chỉnh sửa
    setForm({
      id: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles.map(role => typeof role === 'string' ? role : role.id),
      avatar: user.avatar,
      createdAt: user.createdAt
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      try {
        await userService.deleteUser(id);
        setUsers(users.filter((user) => user.id !== id));
        setError(null);
      } catch (err) {
        setError("Không thể xóa người dùng");
        console.error("Error deleting user:", err);
      }
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="container">
      <div className="container-management">
        <h2>Quản lý người dùng</h2>

        {error && <div className="error-message">{error}</div>}

        {showForm && (
          <UserForm
            form={form}
            setForm={setForm}
            handleSubmit={handleSubmit}
            closeForm={() => setShowForm(false)}
            isEditing={isEditing}
          />
        )}

        <UserTable
          users={currentItems}
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

export default UserManagementPage;
