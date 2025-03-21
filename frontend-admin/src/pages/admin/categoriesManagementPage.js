import React, { useEffect, useState } from "react";
import CategoriesForm from "../../component/Categories/CategoriesForm";
import CategoryTable from "../../component/Categories/CategoriesTable";
import Pagination from "../../component/common/Pagination";
import axios from "axios";

const CategoriesManagementAdPage = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ id: "", name: "", createdAt: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 4;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "https://api.it-ebook.io.vn/api/categories"
      );
      setCategories(response.data);
      setCurrentPage(1); // Reset to first page when data changes
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      setCategories(
        categories.map((category) =>
          category.id === form.id ? form : category
        )
      );
    } else {
      setCategories([
        ...categories,
        {
          ...form,
          id: Date.now(),
          createdAt: new Date().toISOString().split("T")[0],
        },
      ]);
    }
    setForm({ id: "", name: "", createdAt: "" });
    setIsEditing(false);
    setShowForm(false);
  };

  const handleEdit = (category) => {
    setForm(category);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setCategories((prevCategories) => {
      const updatedCategories = prevCategories.filter(
        (category) => category.id !== id
      );
      const newTotalPages = Math.ceil(
        updatedCategories.length / categoriesPerPage
      );
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages || 1); // Keep page number valid after deletion
      }
      return updatedCategories;
    });
  };

  // Determine category list for current page
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = categories.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );
  const totalPages = Math.ceil(categories.length / categoriesPerPage);

  return (
    <div className="container">
      <div className="container-management">
        <h2>Category Management</h2>

        {showForm && (
          <CategoriesForm
            form={form}
            handleInputChange={(e) =>
              setForm({ ...form, [e.target.name]: e.target.value })
            }
            handleSubmit={handleSubmit}
            setShowForm={setShowForm}
            isEditing={isEditing}
          />
        )}

        <CategoryTable
          categories={currentCategories}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          setShowForm={setShowForm}
          setForm={setForm}
          currentPage={currentPage}
          categoriesPerPage={categoriesPerPage}
          setIsEditing={setIsEditing}
          setCurrentPage={setCurrentPage}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default CategoriesManagementAdPage;
