import React from "react";

const UserForm = ({ form, setForm, handleInputChange, handleSubmit, setShowForm, isEditing }) => {
  return (
    <div className="modal-overlay" onClick={() => setShowForm(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="users-form">
          <h3>{isEditing ? "Cập nhật người dùng" : "Thêm mới người dùng"}</h3>
          <input name="name" placeholder="Tên người dùng" value={form.name} onChange={handleInputChange} required />
          <input name="email" placeholder="Email" value={form.email} onChange={handleInputChange} required />
          <input name="password" placeholder="Password" value={form.password} onChange={handleInputChange} required />
          <select name="role" value={form.role} onChange={handleInputChange} required>
            <option value="">Chọn vai trò</option>
            <option value="Admin">Admin</option>
            <option value="User">User</option>
          </select>
          <button type="submit">{isEditing ? "Cập nhật" : "Thêm mới"}</button>
          <button type="button" onClick={() => setShowForm(false)}>Hủy</button>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
