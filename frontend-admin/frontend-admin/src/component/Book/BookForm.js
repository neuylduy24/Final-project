import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const BookForm = ({ book = {}, onSave, setShowForm, isEditing }) => {
  const [formData, setFormData] = useState({
    id: "",
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
  const [imageInputType, setImageInputType] = useState("url"); // "url" or "upload"

  useEffect(() => {
    if (book && isEditing) {
      setFormData(book);
      // If book has categories as array, keep it, otherwise need to convert
      if (book.image) {
        setImagePreview(book.image);
        setImageInputType("url");
      }

      // Set selected categories
      if (book.categories && Array.isArray(book.categories)) {
        setSelectedCategories(book.categories);
      } else if (Array.isArray(book.category)) {
        setSelectedCategories(book.category);
      } else if (book.category) {
        // If it's just a string, create a category object
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

    // Update preview when image URL changes
    if (e.target.name === "image") {
      setImagePreview(e.target.value);
    }
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategories((prevSelected) => {
      // Check if this category is already selected
      const isSelected = prevSelected.some(
        (cat) => cat.id === category.id || cat.name === category.name
      );

      if (isSelected) {
        // If selected, remove from selected list
        return prevSelected.filter(
          (cat) => cat.id !== category.id && cat.name !== category.name
        );
      } else {
        // If not selected, add to selected list
        return [...prevSelected, category];
      }
    });
  };

  const handleCategoriesSave = () => {
    // Update formData with selected categories list
    setFormData((prev) => ({
      ...prev,
      categories: selectedCategories,
      // For API compatibility, keep category field as comma-separated category names
      category: selectedCategories.map((cat) => cat.name).join(", "),
    }));

    setShowCategoryModal(false);
  };

  const handleImageInputTypeChange = (e) => {
    setImageInputType(e.target.value);
    // Clear image data when switching input type
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
      // Create preview URL for image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.title.trim()) {
      toast.error("Please enter book title");
      return;
    }

    if (!formData.author.trim()) {
      toast.error("Please enter book author");
      return;
    }

    if (selectedCategories.length === 0) {
      toast.error("Please select at least one category");
      return;
    }

    // Validate image
    if (imageInputType === "url" && !formData.image.trim()) {
      toast.error("Please enter image URL");
      return;
    }

    if (imageInputType === "upload" && !imageFile) {
      toast.error("Please select an image file to upload");
      return;
    }

    let updatedFormData = { ...formData };

    // Ensure categories field exists
    if (selectedCategories.length > 0) {
      updatedFormData.categories = selectedCategories;
      updatedFormData.category = selectedCategories
        .map((cat) => cat.name)
        .join(", ");
    }

    try {
      // If upload type is selected and there's an image file, upload image first
      if (imageInputType === "upload" && imageFile) {
        try {
          const formDataUpload = new FormData();
          formDataUpload.append("image", imageFile);

          // Replace with your actual image upload API here
          const uploadResponse = await axios.post(
            "https://api.it-ebook.io.vn/api/books/",
            formDataUpload
          );
          updatedFormData.image = uploadResponse.data.imageUrl;
        } catch (error) {
          toast.error("Error uploading image. Please try again.");
          return;
        }
      }

      await onSave(updatedFormData);

      // Show success message
      toast.success(
        isEditing
          ? "✏️ Book updated successfully"
          : "📖 Book added successfully"
      );

      setShowForm(false);
    } catch (error) {
      console.error("Error saving book:", error);
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
                  <span className="no-categories">No categories selected</span>
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

          <div className="image-input-type-selector">
            <label className={imageInputType === "url" ? "active" : ""}>
              <input
                type="radio"
                name="imageInputType"
                value="url"
                checked={imageInputType === "url"}
                onChange={handleImageInputTypeChange}
              />
              Enter Image URL
            </label>
            <label className={imageInputType === "upload" ? "active" : ""}>
              <input
                type="radio"
                name="imageInputType"
                value="upload"
                checked={imageInputType === "upload"}
                onChange={handleImageInputTypeChange}
              />
              Upload Image
            </label>
          </div>

          {imageInputType === "url" ? (
            <input
              type="text"
              name="image"
              placeholder="Image URL"
              value={formData.image}
              onChange={handleChange}
            />
          ) : (
            <input type="file" accept="image/*" onChange={handleImageUpload} />
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
