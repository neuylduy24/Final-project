import React from "react";
const ChapterFormModal = ({
  form,
  setForm,
  handleSubmit,
  closeForm,
  isEditing,
}) => (
  <div className="modal-overlay" onClick={closeForm}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <form onSubmit={handleSubmit} className="container-form">
        <h3>{isEditing ? "Cập nhật chương" : "Thêm mới chương"}</h3>
        <input
          name="name"
          placeholder="Số chương"
          value={form.name}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, name: e.target.value }))
          }
          required
        />
        <input
          name="title"
          placeholder="Tiêu đề"
          value={form.title}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, title: e.target.value }))
          }
          required
        />
        <button type="submit">{isEditing ? "Cập nhật" : "Thêm mới"}</button>
        <button type="button" onClick={closeForm}>
          Hủy
        </button>
      </form>
    </div>
  </div>
);
export default ChapterFormModal;
