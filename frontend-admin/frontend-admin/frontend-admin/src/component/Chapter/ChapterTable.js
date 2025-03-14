import React from "react";
import "./styleForm.scss"
const ChapterTable = ({ chapters, handleEdit, handleDelete, setShowForm }) => {
  return (
    <div className="table-container">
      <div className="table-header">
        <h4>Danh sách chương</h4>
        <button className="add-button" onClick={onAddNew}>Thêm chương mới</button>
      </div>
      
      {isLoading ? (
        <div className="loading">Đang tải dữ liệu...</div>
      ) : (
        <table className="container-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Sách</th>
              <th>Số chương</th>
              <th>Tiêu đề</th>
              <th>Lượt xem</th>
              <th>Ngày tạo</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {chapters.length > 0 ? (
              chapters.map((chapter) => (
                <tr key={chapter.id}>
                  <td>{chapter.id}</td>
                  <td>{chapter.bookTitle || "—"}</td>
                  <td>{chapter.chapterNumber}</td>
                  <td>{chapter.title}</td>
                  <td>{chapter.views}</td>
                  <td>{formatDate(chapter.createdAt)}</td>
                  <td className="button-group">
                    <button className="edit-button" onClick={() => handleEdit(chapter)}>Sửa</button>
                    <button className="delete-button" onClick={() => handleDelete(chapter.id)}>Xóa</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>Không có chương nào</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ChapterTable;
