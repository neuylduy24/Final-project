import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import CategoriesForm from "./CategoriesForm";

const API_URL = "http://150.95.105.147:8080/api/categories";

const CategoriesTable = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Lấy danh sách thể loại từ API
  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(API_URL);
      setCategories(response.data);
    } catch (error) {
      toast.error("Lỗi khi lấy danh sách thể loại!");
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Xử lý thêm & cập nhật thể loại
  const handleSave = async (category) => {
    try {
      if (!isEditing) {
        // Tạo ID mới nếu backend không trả về ID
        const newCategory = {
          ...category,
          id:
            categories.length > 0
              ? Math.max(...categories.map((c) => c.id)) + 1
              : 1,
          createdAt: new Date().toISOString(),
        };

        // Gửi yêu cầu POST lên backend
        const response = await axios.post(API_URL, newCategory);

        // Nếu backend trả về ID, cập nhật lại
        const savedCategory = response.data || newCategory;

        // Cập nhật danh sách categories mà không ghi đè dữ liệu cũ
        setCategories((prevCategories) => [...prevCategories, savedCategory]);

        toast.success("📂 Thêm thể loại thành công!");
      } else {
        // Gửi yêu cầu cập nhật
        await axios.put(`${API_URL}/${category.id}`, category);

        // Cập nhật danh sách categories
        setCategories((prevCategories) =>
          prevCategories.map((c) => (c.id === category.id ? category : c))
        );

        toast.info("✏️ Cập nhật thể loại thành công!");
      }

      setShowForm(false);
    } catch (error) {
      toast.error("❌ Lỗi khi lưu thể loại!");
      console.error("Lỗi khi lưu thể loại:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Gửi yêu cầu xóa lên API
      await axios.delete(`http://150.95.105.147:8080/api/categories/${id}`);
  
      // Cập nhật lại danh sách categories sau khi xóa
      setCategories((prevCategories) => prevCategories.filter((c) => c.id !== id));
  
      toast.warning("🗑️ Xóa thể loại thành công!");
    } catch (error) {
      toast.error("❌ Lỗi khi xóa thể loại!");
      console.error("Lỗi khi xóa thể loại:", error);
    }
  };
  
  
  const handleAddCategory = () => {
    setSelectedCategory(null);
    setShowForm(true);
    setIsEditing(false);
  };

  return (
    <div>
      {showForm && (
        <CategoriesForm
          category={selectedCategory}
          onSave={handleSave}
          setShowForm={setShowForm}
          isEditing={isEditing}
        />
      )}
      <table className="container-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên thể loại</th>
            <th>Ngày tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 ? (
            categories.map((category) => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.name}</td>
                <td>{category.createdAt}</td>
                <td className="button-group">
                  <button className="add-button" onClick={handleAddCategory}>
                  ➕ Thêm
                  </button>

                  <button
                    className="edit-button"
                    onClick={() => {
                      setSelectedCategory(category);
                      setShowForm(true);
                      setIsEditing(true);
                    }}
                  >
                    ✏️ Sửa
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(category.id)}
                  >
                    🗑️ Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                Không có thể loại nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategoriesTable;
