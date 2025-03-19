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
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageInputType, setImageInputType] = useState("url"); // "url" hoặc "upload"

  useEffect(() => {
    if (book && isEditing) {
      setFormData(book);
      // Nếu sách có categories đã là mảng, giữ nguyên, nếu không, cần chuyển đổi
      if (book.image) {
        setImagePreview(book.image);
        setImageInputType("url");
      }
      
      // Thiết lập thể loại đã chọn
      if (book.categories && Array.isArray(book.categories)) {
        setSelectedCategories(book.categories);
      } else if (Array.isArray(book.category)) {
        setSelectedCategories(book.category);
      } else if (book.category) {
        // Nếu chỉ là chuỗi, tạo đối tượng thể loại
        setSelectedCategories([{ id: 'temp', name: book.category }]);
      }
    }
  }, [book, isEditing]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("https://api.it-ebook.io.vn/api/categories");
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

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prevSelected => {
      // Kiểm tra xem thể loại này đã được chọn chưa
      const isSelected = prevSelected.some(cat => cat.id === category.id || cat.name === category.name);
      
      if (isSelected) {
        // Nếu đã chọn, loại bỏ khỏi danh sách đã chọn
        return prevSelected.filter(cat => cat.id !== category.id && cat.name !== category.name);
      } else {
        // Nếu chưa chọn, thêm vào danh sách đã chọn
        return [...prevSelected, category];
      }
    });
  };

  const handleCategoriesSave = () => {
    // Cập nhật formData với danh sách thể loại đã chọn
    setFormData(prev => ({
      ...prev,
      categories: selectedCategories,
      // Để tương thích với API, vẫn giữ trường category là chuỗi các tên thể loại được ngăn cách bởi dấu phẩy
      category: selectedCategories.map(cat => cat.name).join(', ')
    }));
    
    setShowCategoryModal(false);
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
    
    // Đảm bảo có trường categories
    if (selectedCategories.length > 0) {
      updatedFormData.categories = selectedCategories;
      updatedFormData.category = selectedCategories.map(cat => cat.name).join(', ');
    }
    
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

          <div className="category-selector">
            <div className="selected-categories">
              <label>Thể loại đã chọn:</label>
              <div className="category-tags">
                {selectedCategories.length > 0 ? (
                  selectedCategories.map((cat, index) => (
                    <span key={cat.id || `category-${index}`} className="category-tag">
                      {cat.name}
                      <button 
                        type="button" 
                        className="remove-category" 
                        onClick={() => handleCategoryToggle(cat)}
                      >
                        ×
                      </button>
                    </span>
                  ))
                ) : (
                  <span className="no-categories">Chưa chọn thể loại</span>
                )}
              </div>
            </div>
            <button 
              type="button" 
              className="select-categories-button"
              onClick={() => setShowCategoryModal(true)}
            >
              Chọn thể loại
            </button>
          </div>

          {showCategoryModal && (
            <div className="category-modal" onClick={(e) => {
              if (e.target.className === 'category-modal') setShowCategoryModal(false);
            }}>
              <div className="category-modal-content">
                <h4>Chọn thể loại</h4>
                <div className="category-list">
                  {categories.map(category => (
                    <div key={category.id} className="category-checkbox-item">
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedCategories.some(
                            cat => cat.id === category.id || cat.name === category.name
                          )}
                          onChange={() => handleCategoryToggle(category)}
                        />
                        <span>{category.name}</span>
                      </label>
                    </div>
                  ))}
                </div>
                <div className="modal-actions">
                  <button 
                    type="button" 
                    className="save-categories" 
                    onClick={handleCategoriesSave}
                  >
                    Xác nhận
                  </button>
                  <button 
                    type="button" 
                    className="cancel" 
                    onClick={() => setShowCategoryModal(false)}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          )}

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
