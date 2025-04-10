import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import CategoriesForm from "./CategoriesForm";
import { FaSearch } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "https://api.it-ebook.io.vn/api/categories";

const CategoriesTable = ({
  currentPage,
  categoriesPerPage,
  setCurrentPage,
}) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);

  // Get category list from API
  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(API_URL);
      setCategories(response.data);
      setFilteredCategories(response.data);
    } catch (error) {
      toast.error("🚨 Error fetching categories!");
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Handle search
  useEffect(() => {
    const filtered = categories.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  // Handle add & update category
  const handleSave = async (category) => {
    try {
      if (!isEditing) {
        const newCategory = {
          ...category,
          id:
            categories.length > 0
              ? Math.max(...categories.map((c) => c.id)) + 1
              : 1,
          createdAt: new Date().toISOString(),
        };

        const response = await axios.post(API_URL, newCategory);
        const savedCategory = response.data || newCategory;
        setCategories((prevCategories) => [...prevCategories, savedCategory]);

        toast.success(
          `📂 Added category "${savedCategory.name}" successfully!`
        );
      } else {
        await axios.put(`${API_URL}/${category.id}`, category);
        setCategories((prevCategories) =>
          prevCategories.map((c) => (c.id === category.id ? category : c))
        );
        toast.info(`✏️ Updated category "${category.name}"!`);
      }

      setShowForm(false);
    } catch (error) {
      toast.error("❌ Error saving category!");
      console.error("Error saving category:", error);
    }
  };

  // Handle delete category
  const handleDelete = async (id) => {
    // Check if ID is invalid (null, undefined, empty)
    if (!id || id === "" || id === null || id === undefined) {
      toast.error("❌ Cannot delete category due to invalid ID!");
      return;
    }

    const categoryToDelete = categories.find((c) => c.id === id);
    if (!categoryToDelete) {
      toast.error("❌ Category not found!");
      return;
    }

    try {
      await axios.delete(`${API_URL}/${id}`);
      setCategories((prevCategories) =>
        prevCategories.filter((c) => c.id !== id)
      );
      toast.warning(`🗑️ Deleted category "${categoryToDelete.name}"!`);
    } catch (error) {
      toast.error("❌ Error deleting category!");
      console.error("Error deleting category:", error);
    }
  };

  // Open add category form
  const handleAddCategory = () => {
    setSelectedCategory(null);
    setShowForm(true);
    setIsEditing(false);
  };

  const indexOfLastBook = currentPage * categoriesPerPage;
  const indexOfFirstBook = indexOfLastBook - categoriesPerPage;
  const currentCategories = filteredCategories.slice(
    indexOfFirstBook,
    indexOfLastBook
  );

  return (
    <div>
      <ToastContainer position="top-right" autoClose={2000} />
      {showForm && (
        <CategoriesForm
          category={selectedCategory}
          onSave={handleSave}
          setShowForm={setShowForm}
          isEditing={isEditing}
        />
      )}

      {/* Search bar */}
      <div className="search-container">
        <FaSearch className="search-icon" />
        <input
          className="search-input"
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn-add" onClick={handleAddCategory}>
          Add New Categories
        </button>
      </div>

      {/* Category list table */}
      <table className="container-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Category Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentCategories.length > 0 ? (
            currentCategories.map((category) => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.name}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-edit"
                      onClick={() => {
                        setSelectedCategory(category);
                        setShowForm(true);
                        setIsEditing(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(category.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                No categories found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategoriesTable;
