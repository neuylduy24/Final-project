import React from "react";
const UserTable = ({ users = [], handleEdit, handleDelete, setShowForm, setForm, setIsEditing }) => {
  return (
    <table className="container-table">
      <thead>
        <tr>
          <th>Id</th>
          <th>Tên người dùng</th>
          <th>Email</th>
          <th>Role</th>
          <th>Password</th>
          <th>Ngày tạo</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
      {users.length > 0 ? (
        users.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>{user.password}</td>
            <td>{user.createdAt}</td>
            <td className="button-group">
              <button className="add-button" onClick={() => {
                setShowForm(true);
                setForm({ id: "", name: "", email: "", role: "", password: "", createdAt: "" });
                setIsEditing(false);
              }}>Thêm</button>
              <button className="edit-button" onClick={() => handleEdit(user)}>Sửa</button>
              <button className="delete-button" onClick={() => handleDelete(user.id)}>Xóa</button>
            </td>
          </tr>
        ))) : (
          <tr>
            <td colSpan="7" style={{ textAlign: "center" }}>Không có người dùng nào</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default UserTable;
