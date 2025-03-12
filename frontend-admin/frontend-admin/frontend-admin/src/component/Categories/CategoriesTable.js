import React from "react";
import "./styleForm.scss"
const CategoriesTable = ({ categories, handleEdit, handleDelete, setShowForm, setForm, setIsEditing }) => {
  return (
      <table className="categories-table">
        <thead>
          <tr className="categories-title">
            <th>Id</th>
            <th>Tên thể loại</th>
            <th>Ngày tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
        {categories.length > 0 ? (
         categories.map((category) => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>{category.name}</td>
              <td>{category.createdAt}</td>
              <td className="button-group">
                <button className="add-button" onClick={() => {
                  setShowForm(true);
                  setForm({ id: "", name: "", createdAt: "" });
                  setIsEditing(false);
                }}>Thêm</button>
                <button className="edit-button" onClick={() => handleEdit(category)}>Sửa</button>
                <button className="delete-button" onClick={() => handleDelete(category.id)}>Xóa</button>
              </td>
            </tr>
          ))
        ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>Không có thể loại nào</td>
            </tr>
          )}
        </tbody>
      </table>
  );
};

export default CategoriesTable;
