import React, { useState } from "react";
import CategoriesForm from "../../component/Categories/CategoriesForm";
import CategoryTable from "../../component/Categories/CategoriesTable";
import Pagination from "../../component/common/Pagination";

const CategoriesManagementAdPage = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: "Tình cảm", createdAt: "2024-01-15" },
    { id: 2, name: "Trinh thám", createdAt: "2024-02-20" },
    { id: 3, name: "Hài hước", createdAt: "2024-03-10" },
    { id: 4, name: "Kinh dị", createdAt: "2024-04-05" },
    { id: 5, name: "Khoa học", createdAt: "2024-05-22" },
    { id: 6, name: "Lịch sử", createdAt: "2024-06-30" },
    { id: 7, name: "Viễn tưởng", createdAt: "2024-06-30" },
  ]);
  
  const [form, setForm] = useState({ id: "", name: "", createdAt: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 4;

  const handleInputChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      setCategories(categories.map((category) => (category.id === form.id ? form : category)));
    } else {
      setCategories([...categories, { ...form, id: Date.now(), createdAt: new Date().toISOString().split("T")[0] }]);
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

  const handleDelete = (id) => setCategories(categories.filter((category) => category.id !== id));

  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);
  const totalPages = Math.ceil(categories.length / categoriesPerPage);

  return (
    <div className="container">
      <div className="categories">
        <h2>Quản lý thể loại</h2>

        {showForm && (
          <CategoriesForm 
            form={form} 
            handleInputChange={handleInputChange} 
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
          setIsEditing={setIsEditing} 
        />

        <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
      </div>
    </div>
  );
};

export default CategoriesManagementAdPage;
