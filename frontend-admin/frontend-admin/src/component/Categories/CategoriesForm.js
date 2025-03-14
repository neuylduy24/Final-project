import React from "react";
const CategoriesForm = ({ form, handleInputChange, handleSubmit, setShowForm, isEditing }) => {
  return (
    <div className="modal-overlay" onClick={() => setShowForm(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="categories-form">
          <h3>{isEditing ? "Cập nhật thể loại" : "Thêm mới thể loại"}</h3>
          <input name="name" placeholder="Tên thể loại" value={form.name} onChange={handleInputChange} required />
          <button type="submit">{isEditing ? "Cập nhật" : "Thêm mới"}</button>
          <button type="button" onClick={() => setShowForm(false)}>Hủy</button>
        </form>
      </div>
    </div>
  );
};

export default CategoriesForm;
