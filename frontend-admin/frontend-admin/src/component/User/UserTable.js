import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

// Thêm mảng các màu pastel đẹp mắt
const AVATAR_COLORS = [
  "#FF9AA2",
  "#FFB7B2",
  "#FFDAC1",
  "#E2F0CB",
  "#B5EAD7",
  "#C7CEEA",
  "#E8E8E4",
  "#F8B195",
  "#F67280",
  "#C06C84",
  "#6C5B7B",
  "#355C7D",
];

// Hàm lấy màu ngẫu nhiên dựa trên username
const getRandomColor = (username) => {
  const index = username
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
};

const UserTable = ({ users, handleEdit, handleDelete, setShowForm }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);

  // Hàm chuyển đổi có dấu thành không dấu
  const removeAccents = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };

  // Cập nhật danh sách users đã lọc khi users hoặc searchTerm thay đổi
  useEffect(() => {
    const filtered = users.filter((user) => {
      const searchLower = removeAccents(searchTerm.toLowerCase());

      // Tìm trong username
      const usernameMatch =
        user.username &&
        removeAccents(user.username.toLowerCase()).includes(searchLower);

      // Tìm trong email
      const emailMatch =
        user.email &&
        removeAccents(user.email.toLowerCase()).includes(searchLower);

      return usernameMatch || emailMatch;
    });
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  // Hàm hiển thị vai trò với các màu sắc khác nhau
  const renderRoles = (roles) => {
    if (!roles || roles.length === 0) return <span>No roles</span>;

    return (
      <div className="role-badges">
        {roles.map((role, index) => {
          let roleClass = "";

          // Xác định class dựa trên tên vai trò
          if (typeof role === "string") {
            const roleLower = role.toLowerCase();
            if (roleLower.includes("admin")) roleClass = "admin";
            else if (roleLower.includes("author")) roleClass = "author";
            else if (roleLower.includes("reader")) roleClass = "reader";
          } else if (role.name) {
            const roleLower = role.name.toLowerCase();
            if (roleLower.includes("admin")) roleClass = "admin";
            else if (roleLower.includes("author")) roleClass = "author";
            else if (roleLower.includes("reader")) roleClass = "reader";
          }

          return (
            <span key={index} className={`role-badge ${roleClass}`}>
              {typeof role === "string" ? role : role.name}
            </span>
          );
        })}
      </div>
    );
  };

  // Hàm format ngày tạo
  const formatCreatedDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "N/A";
      }
      return new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (error) {
      console.error("❌ Error formatting date:", error);
      return "N/A";
    }
  };

  return (
    <div>
      <div className="search-container">
        <FaSearch className="search-icon" />
        <input
          className="search-input"
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn-add" onClick={() => setShowForm(true)}>
          Add New User
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Email</th>
            <th>Role</th>
            <th>Created Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                {searchTerm ? "No matching users found" : "No users yet"}
              </td>
            </tr>
          ) : (
            filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>
                  <div className="user-info">
                    {user.avatar ? (
                      <img
                        className="user-avatar"
                        src={user.avatar}
                        alt={user.username}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = "none";
                          const parent = e.target.parentElement;
                          const avatarText = document.createElement("div");
                          avatarText.className = "user-avatar";
                          avatarText.style.backgroundColor = getRandomColor(
                            user.username || ""
                          );
                          avatarText.style.display = "flex";
                          avatarText.style.justifyContent = "center";
                          avatarText.style.alignItems = "center";
                          avatarText.style.color = "#ffffff";
                          avatarText.style.fontWeight = "bold";
                          avatarText.style.fontSize = "16px";
                          avatarText.style.textTransform = "uppercase";
                          avatarText.style.width = "40px";
                          avatarText.style.height = "40px";
                          avatarText.style.borderRadius = "50%";
                          avatarText.textContent = user.username
                            ? user.username.charAt(0)
                            : "?";
                          parent.insertBefore(avatarText, e.target);
                        }}
                      />
                    ) : (
                      <div
                        className="user-avatar"
                        style={{
                          backgroundColor: getRandomColor(user.username || ""),
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          color: "#ffffff",
                          fontWeight: "bold",
                          fontSize: "16px",
                          textTransform: "uppercase",
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                        }}
                      >
                        {user.username ? user.username.charAt(0) : "?"}
                      </div>
                    )}
                    {user.username}
                  </div>
                </td>
                <td>{user.email}</td>
                <td>{renderRoles(user.roles)}</td>
                <td>{formatCreatedDate(user.createdAt)}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
