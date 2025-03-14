import React, { useState, useEffect } from "react";
import axios from "axios";

const BookForm = ({ book = {}, onSave, setShowForm, isEditing }) => {
  const [formData, setFormData] = useState({
    id: Date.now().toString(),
    title: "",
    author: "",
    category: "",
    image: "",
    createdAt: new Date().toISOString().split("T")[0],
  });

  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageInputType, setImageInputType] = useState("url"); // "url" hoặc "upload"

  useEffect(() => {
    if (book && isEditing) {
      setFormData(book);
      if (book.image) {
        setImagePreview(book.image);
        // Nếu đang chỉnh sửa và đã có URL ảnh, mặc định chọn kiểu URL
        setImageInputType("url");
      }
    }
  }, [book, isEditing]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("https://api.it-ebook.io.vn/api/books");
      setCategories(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách thể loại:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Cập nhật preview khi URL ảnh thay đổi
    if (e.target.name === "image") {
      setImagePreview(e.target.value);
    }
  };

  const handleImageInputTypeChange = (e) => {
    setImageInputType(e.target.value);
    // Xóa dữ liệu ảnh khi chuyển kiểu nhập
    if (e.target.value === "url") {
      setImageFile(null);
      setImagePreview(formData.image);
    } else {
      setFormData({ ...formData, image: "" });
      setImagePreview("");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Tạo URL xem trước cho ảnh
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let updatedFormData = { ...formData };
    
    // Nếu chọn kiểu upload và có file ảnh, upload ảnh trước
    if (imageInputType === "upload" && imageFile) {
      try {
        const formDataUpload = new FormData();
        formDataUpload.append("image", imageFile);
        
        // Thay thế API upload ảnh thực tế của bạn tại đây
        const uploadResponse = await axios.post("http://150.95.105.147:8080/api/upload", formDataUpload);
        updatedFormData.image = uploadResponse.data.imageUrl;
      } catch (error) {
        console.error("Lỗi khi upload ảnh:", error);
      }
    }
    
    onSave(updatedFormData);
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

          <div className="image-input-type-selector">
            <label className={imageInputType === "url" ? "active" : ""}>
              <input
                type="radio"
                name="imageInputType"
                value="url"
                checked={imageInputType === "url"}
                onChange={handleImageInputTypeChange}
              />
              Nhập URL ảnh
            </label>
            <label className={imageInputType === "upload" ? "active" : ""}>
              <input
                type="radio"
                name="imageInputType"
                value="upload"
                checked={imageInputType === "upload"}
                onChange={handleImageInputTypeChange}
              />
              Upload ảnh
            </label>
          </div>

          {imageInputType === "url" && (
            <input
              type="text"
              name="image"
              placeholder="URL ảnh bìa sách"
              value={formData.image}
              onChange={handleChange}
            />
          )}

          {imageInputType === "upload" && (
            <div className="image-upload-container">
              <label htmlFor="image-upload" className="image-upload-label">
                Upload ảnh bìa sách
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
              </label>
            </div>
          )}

          {imagePreview && (
            <div className="image-preview">
              <img 
                src={imagePreview} 
                alt="Xem trước ảnh bìa sách" 
                style={{ maxWidth: "100px", maxHeight: "150px", marginTop: "10px" }} 
              />
            </div>
          )}

          <button type="submit">{isEditing ? "Cập nhật" : "Thêm mới"}</button>
          <button type="button" onClick={() => setShowForm(false)}>Hủy</button>
        </form>
      </div>
    </div>
  );
};

export default BookForm;
