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
        "http://150.95.105.147:8080/api/categories"
      );
      setCategories(response.data);
      setCurrentPage(1); // Reset về trang đầu tiên khi dữ liệu thay đổi
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu thể loại:", error);
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
        setCurrentPage(newTotalPages || 1); // Giữ trang hợp lệ sau khi xóa
      }
      return updatedCategories;
    });
  };

  // Xác định danh sách thể loại cho trang hiện tại
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
        <h2>Quản lý thể loại</h2>

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
