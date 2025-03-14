import React, { useState, useEffect } from "react";
import axios from "axios";

const BookForm = ({ book = {}, onSave, setShowForm, isEditing }) => {
  const [formData, setFormData] = useState({
    id: Date.now().toString(),
    title: "",
    author: "",
    category: "",
    createdAt: new Date().toISOString().split("T")[0],
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (book && isEditing) {
      setFormData(book);
    }
  }, [book, isEditing]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://150.95.105.147:8080/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách thể loại:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={() => setShowForm(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="container-form">
          <h3>{isEditing ? "Chỉnh sửa sách" : "Thêm mới sách"}</h3>

          <input
            type="text"
            name="title"
            placeholder="Tiêu đề"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="author"
            placeholder="Tác giả"
            value={formData.author}
            onChange={handleChange}
            required
          />

          <select name="category" value={formData.category} onChange={handleChange} required>
            <option value="">Chọn thể loại</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          <button type="submit">{isEditing ? "Cập nhật" : "Thêm mới"}</button>
          <button type="button" onClick={() => setShowForm(false)}>Hủy</button>
        </form>
      </div>
    </div>
  );
};

export default BookForm;
