import React, { useState, useEffect } from "react";
import UserForm from "../../component/User/UserForm";
import UserTable from "../../component/User/UserTable";
import Pagination from "../../component/common/Pagination";
import userService from "../../service/userService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/userManagement.scss";
import "../../styles/chapterManagement.scss";


const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    roles: [],
    avatar: "",
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
      toast.error("Error loading user list");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e, updatedForm) => {
    e.preventDefault();
    try {
      const formToSubmit = updatedForm || form;

      if (!isEditing) {
        formToSubmit.roles = [2];
      }

      if (isEditing) {
        await userService.updateUser(formToSubmit.id, formToSubmit);
        setUsers(
          users.map((user) =>
            user.id === formToSubmit.id ? formToSubmit : user
          )
        );
      } else {
        const newUser = await userService.createUser(formToSubmit);
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
        avatar: "",
      });
      setIsEditing(false);
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError(isEditing ? "Unable to update user" : "Unable to add new user");
      toast.error(isEditing ? "Error updating user" : "Error adding user");
      console.error("Error submitting user:", err);
    }
  };

  const handleEdit = (user) => {
    setForm({
      id: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles.map((role) =>
        typeof role === "string" ? role : role.id
      ),
      avatar: user.avatar,
      createdAt: user.createdAt,
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await userService.deleteUser(id);
      setUsers(users.filter((user) => user.id !== id));
      setError(null);
      toast.success("🗑️ User deleted successfully");
    } catch (err) {
      setError("Unable to delete user");
      toast.error("Error deleting user");
      console.error("Error deleting user:", err);
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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        closeOnClick={false}
        pauseOnHover={true}
        draggable={true}
      />
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
