import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const BookForm = ({ book = {}, onSave, setShowForm, isEditing }) => {
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    author: "",
    description: "",
    category: "",
    image: "",
    createdAt: new Date().toISOString().split("T")[0],
  });

  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageInputType, setImageInputType] = useState("url");

  useEffect(() => {
    if (book && isEditing) {
      setFormData(book);

      if (book.image) {
        setImagePreview(book.image);
        setImageInputType("url");
      }

      if (Array.isArray(book.categories)) {
        setSelectedCategories(book.categories);
      } else if (Array.isArray(book.category)) {
        setSelectedCategories(book.category);
      } else if (book.category) {
        setSelectedCategories([{ id: "temp", name: book.category }]);
      }
    }
  }, [book, isEditing]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "https://api.it-ebook.io.vn/api/categories"
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.name === "image") {
      setImagePreview(e.target.value);
    }
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategories((prev) => {
      const isSelected = prev.some(
        (cat) => cat.id === category.id || cat.name === category.name
      );
      return isSelected
        ? prev.filter(
            (cat) =>
              cat.id !== category.id && cat.name !== category.name
          )
        : [...prev, category];
    });
  };

  const handleCategoriesSave = () => {
    setFormData((prev) => ({
      ...prev,
      category: selectedCategories.map((cat) => cat.name).join(", "),
    }));
    setShowCategoryModal(false);
  };

  const handleImageInputTypeChange = (e) => {
    setImageInputType(e.target.value);
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
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.title.trim()) {
    toast.error("Vui lòng nhập tiêu đề sách");
    return;
  }

  const categoryString = selectedCategories.map((cat) => cat.name).join(", ").trim();
  if (!categoryString) {
    toast.error("Vui lòng chọn ít nhất một thể loại");
    return;
  }

  const formPayload = new FormData();
  formPayload.append("title", formData.title);
  formPayload.append("author", formData.author || "");
  formPayload.append("description", formData.description || "");

  // ✅ Nếu backend nhận 1 chuỗi category phân cách dấu phẩy
  formPayload.append("category", categoryString);

  // ✅ Nếu dùng ảnh URL
  if (imageInputType === "url") {
    if (!formData.image || !formData.image.trim()) {
      toast.error("Vui lòng nhập URL ảnh");
      return;
    }
    formPayload.append("imageUrl", formData.image.trim());
  }

  // ✅ Nếu upload ảnh file
  if (imageInputType === "upload") {
    if (!imageFile) {
      toast.error("Vui lòng chọn ảnh để tải lên");
      return;
    }
    formPayload.append("file", imageFile);
  }

  try {
    const response = await axios.post(
      "https://api.it-ebook.io.vn/api/books/create-with-image",
      formPayload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    toast.success("Thêm sách thành công!");
    onSave && onSave(response.data);
    setShowForm(false);
  } catch (error) {
    console.error("Create book error:", error);
    toast.error(error?.response?.data || "Đã xảy ra lỗi khi thêm sách.");
  }
};


  return (
    <div className="modal-overlay" onClick={() => setShowForm(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="container-form">
          <h3>{isEditing ? "Edit Book" : "Add New Book"}</h3>

          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
          />

          <input
            type="text"
            name="author"
            placeholder="Author"
            value={formData.author}
            onChange={handleChange}
          />

          <div className="category-selector">
            <div className="selected-categories">
              <label>Selected Categories:</label>
              <div className="category-tags">
                {selectedCategories.length > 0 ? (
                  selectedCategories.map((cat, index) => (
                    <span
                      key={cat.id || `category-${index}`}
                      className="category-tag"
                    >
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
                  <span className="no-categories">
                    No categories selected
                  </span>
                )}
              </div>
            </div>
            <button
              type="button"
              className="select-categories-button"
              onClick={() => setShowCategoryModal(true)}
            >
              Select Categories
            </button>
          </div>

          {showCategoryModal && (
            <div
              className="category-modal"
              onClick={(e) => {
                if (e.target.className === "category-modal")
                  setShowCategoryModal(false);
              }}
            >
              <div className="category-modal-content">
                <h4>Select Categories</h4>
                <div className="category-list">
                  {categories.map((category) => (
                    <div key={category.id} className="category-checkbox-item">
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedCategories.some(
                            (cat) =>
                              cat.id === category.id ||
                              cat.name === category.name
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
                    Confirm
                  </button>
                  <button
                    type="button"
                    className="cancel"
                    onClick={() => setShowCategoryModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div>
            <label>
              <input
                type="radio"
                value="url"
                checked={imageInputType === "url"}
                onChange={handleImageInputTypeChange}
              />
              Image URL
            </label>
            <label>
              <input
                type="radio"
                value="upload"
                checked={imageInputType === "upload"}
                onChange={handleImageInputTypeChange}
              />
              Upload File
            </label>
          </div>

          {imageInputType === "url" ? (
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Enter image URL"
            />
          ) : (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
          )}

          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="save">
              {isEditing ? "Update" : "Add"}
            </button>
            <button
              type="button"
              className="cancel"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookForm;
