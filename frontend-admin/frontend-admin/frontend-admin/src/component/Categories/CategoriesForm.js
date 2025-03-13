import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "../../styles/pages/styleForm.scss";

const CategoriesForm = ({ category = {}, onSave, setShowForm, isEditing }) => {
  const [formData, setFormData] = useState({
    id: Date.now().toString(),
    name: "",
    createdAt: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (category && isEditing) {
      setFormData(category);
    } else {
      setFormData({
        id: Date.now().toString(),
        name: "",
        createdAt: new Date().toISOString().split("T")[0],
      });
    }
  }, [category, isEditing]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("⚠️ Vui lòng nhập tên thể loại!");
      return;
    }
    await onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={() => setShowForm(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="container-form">
          <h3>{isEditing ? "Chỉnh sửa thể loại" : "Thêm mới thể loại"}</h3>
          <input
            type="text"
            name="name"
            placeholder="Tên thể loại"
            value={formData.name}
            onChange={handleChange}
            required
          />
            <button type="submit">{isEditing ? "Cập nhật" : "Thêm mới"}</button>
            <button type="button" onClick={() => setShowForm(false)}>Hủy</button>
        </form>
      </div>
    </div>
  );
};

export default CategoriesForm;
