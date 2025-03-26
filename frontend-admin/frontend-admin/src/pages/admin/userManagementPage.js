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
      setError("Unable to load user list. Please try again later.");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e, updatedForm) => {
    e.preventDefault();
    try {
      const formToSubmit = updatedForm || form;
      
      // If not editing, ensure role is reader
      if (!isEditing) {
        formToSubmit.roles = [2]; // Assuming 2 is the ID for reader role, adjust if needed
      }
      
      if (isEditing) {
        // When editing, keep current roles
        await userService.updateUser(formToSubmit.id, formToSubmit);
        setUsers(users.map((user) => (user.id === formToSubmit.id ? formToSubmit : user)));
      } else {
        const newUser = await userService.createUser(formToSubmit);
        
        // Ensure createdAt field exists
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
      setError(isEditing ? "Unable to update user" : "Unable to add new user");
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
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await userService.deleteUser(id);
        setUsers(users.filter((user) => user.id !== id));
        setError(null);
      } catch (err) {
        setError("Unable to delete user");
        console.error("Error deleting user:", err);
      }
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="container-management">
        <h2>User Management</h2>

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
