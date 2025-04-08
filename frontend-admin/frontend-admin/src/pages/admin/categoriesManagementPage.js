import React, { useEffect, useState } from "react";
import CategoriesForm from "../../component/Categories/CategoriesForm";
import CategoryTable from "../../component/Categories/CategoriesTable";
import Pagination from "../../component/common/Pagination";
import categoryService from "../../service/categoryService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CategoriesManagementAdPage = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ id: "", name: "", createdAt: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const categoriesPerPage = 4;

  // Calculate pagination
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = categories.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );
  const totalPages = Math.ceil(categories.length / categoriesPerPage);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Adjust current page when categories length changes
  useEffect(() => {
    const maxPage = Math.ceil(categories.length / categoriesPerPage);
    if (currentPage > maxPage) {
      setCurrentPage(Math.max(1, maxPage));
    }
  }, [categories.length, currentPage]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAllCategories();
      const formattedData = Array.isArray(data) ? data : [];
      setCategories(formattedData);
    } catch (error) {
      toast.error("Error fetching categories: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const updatedCategory = await categoryService.updateCategory(form.id, form);
        setCategories(prevCategories =>
          prevCategories.map(category =>
            category.id === updatedCategory.id ? updatedCategory : category
          )
        );
      } else {
        const newCategory = await categoryService.createCategory({
          ...form,
          createdAt: new Date().toISOString()
        });
        setCategories(prevCategories => [...prevCategories, newCategory]);
        // Set to last page when adding new category
        const newTotalPages = Math.ceil((categories.length + 1) / categoriesPerPage);
        setCurrentPage(newTotalPages);
      }

      setForm({ id: "", name: "", createdAt: "" });
      setIsEditing(false);
      setShowForm(false);
    } catch (error) {
      toast.error("Error saving category: " + error.message);
    }
  };

  const handleEdit = (category) => {
    setForm(category);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await categoryService.deleteCategory(id);
      // Update local state
      setCategories(prevCategories => {
        const updatedCategories = prevCategories.filter(
          category => category.id !== id
        );
        return updatedCategories;
      });
    } catch (error) {
      toast.error("Error deleting category: " + error.message);
    }
  };

  if (loading && categories.length === 0) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
      <ToastContainer position="top-right" autoClose={3000} />
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
          loading={loading}
        />
        {categories.length > categoriesPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default CategoriesManagementAdPage;
