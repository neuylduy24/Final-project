import React from "react";
import "./styleForm.scss"
const ChapterTable = ({ chapters, handleEdit, handleDelete, setShowForm }) => {
  return (
      <table className="container-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Số chương</th>
            <th>Tiêu đề</th>
            <th>Ngày tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {chapters.length > 0 ? (
            chapters.map((ch) => (
              <tr key={ch.id}>
                <td>{ch.id}</td>
                <td>{ch.name}</td>
                <td>{ch.title}</td>
                <td>{ch.createdAt}</td>
                <td className="button-group">
                  <button className="add-button" onClick={() => setShowForm(true)}>Thêm</button>
                  <button className="edit-button" onClick={() => handleEdit(ch)}>Sửa</button>
                  <button className="delete-button" onClick={() => handleDelete(ch.id)}>Xóa</button>
                </td>
              </tr>
            ))) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>Không có chương nào</td>
            </tr>
          )}
        </tbody>
      </table>
  );
};


export default ChapterTable;
