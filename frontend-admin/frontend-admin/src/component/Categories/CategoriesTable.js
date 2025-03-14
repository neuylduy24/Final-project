import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import CategoriesForm from "./CategoriesForm";
import { FaSearch } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "http://150.95.105.147:8080/api/categories";

const CategoriesTable = ({currentPage, categoriesPerPage, setCurrentPage}) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);

  // Lấy danh sách thể loại từ API
  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(API_URL);
      setCategories(response.data);
      setFilteredCategories(response.data);
    } catch (error) {
      toast.error("🚨 Lỗi khi lấy danh sách thể loại!");
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Xử lý tìm kiếm
  useEffect(() => {
    const filtered = categories.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  // Xử lý thêm & cập nhật thể loại
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
          `📂 Đã thêm thể loại "${savedCategory.name}" thành công!`
        );
      } else {
        await axios.put(`${API_URL}/${category.id}`, category);
        setCategories((prevCategories) =>
          prevCategories.map((c) => (c.id === category.id ? category : c))
        );
        toast.info(`✏️ Đã cập nhật thể loại "${category.name}"!`);
      }

      setShowForm(false);
    } catch (error) {
      toast.error("❌ Lỗi khi lưu thể loại!");
      console.error("Lỗi khi lưu thể loại:", error);
    }
  };

  // Xử lý xóa thể loại
  const handleDelete = async (id) => {
    // Kiểm tra nếu ID không hợp lệ (null, undefined, rỗng)
    if (!id || id === "" || id === null || id === undefined) {
      toast.error("❌ Không thể xóa thể loại vì thiếu ID hợp lệ!");
      return;
    }
  
    const categoryToDelete = categories.find((c) => c.id === id);
    if (!categoryToDelete) {
      toast.error("❌ Không tìm thấy thể loại để xóa!");
      return;
    }
  
    try {
      await axios.delete(`${API_URL}/${id}`);
      setCategories((prevCategories) =>
        prevCategories.filter((c) => c.id !== id)
      );
      toast.warning(`🗑️ Đã xóa thể loại "${categoryToDelete.name}"!`);
    } catch (error) {
      toast.error("❌ Lỗi khi xóa thể loại!");
      console.error("Lỗi khi xóa thể loại:", error);
    }
  };
  // const deleteEmptyCategories = async () => {
  //   try {
  //     // Lọc các thể loại có ID rỗng hoặc không hợp lệ
  //     const emptyCategories = categories.filter((c) => !c.id || c.id === "");
  
  //     if (emptyCategories.length === 0) {
  //       toast.info("✅ Không có thể loại nào có ID rỗng để xóa!");
  //       return;
  //     }
  
  //     // Chỉ gửi yêu cầu DELETE nếu ID hợp lệ
  //     await Promise.all(
  //       emptyCategories
  //         .filter((c) => c.id) // Chặn gửi ID rỗng
  //         .map(async (category) => {
  //           await axios.delete(`${API_URL}/${category.id}`);
  //         })
  //     );
  
  //     // Cập nhật danh sách thể loại sau khi xóa
  //     setCategories((prevCategories) =>
  //       prevCategories.filter((c) => c.id) // Xóa thể loại có ID rỗng khỏi UI
  //     );
  
  //     toast.success("🗑️ Đã xóa tất cả thể loại có ID rỗng!");
  //   } catch (error) {
  //     toast.error("❌ Lỗi khi xóa các thể loại có ID rỗng!");
  //     console.error("Lỗi khi xóa thể loại:", error);
  //   }
  // };
  
  
  

  // Mở form thêm thể loại
  const handleAddCategory = () => {
    setSelectedCategory(null);
    setShowForm(true);
    setIsEditing(false);
  };
  const indexOfLastBook = currentPage * categoriesPerPage;
  const indexOfFirstBook = indexOfLastBook - categoriesPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstBook, indexOfLastBook);

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

      {/* Thanh tìm kiếm */}
      <div className="search-container">
        <FaSearch className="search-icon" />
        <input
          className="search-input"
          type="text"
          placeholder="Tìm kiếm thể loại..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="add-button" onClick={handleAddCategory}>
          ➕ Thêm
        </button>
      </div>

      {/* Bảng danh sách thể loại */}
      <table className="container-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên thể loại</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentCategories.length > 0 ? (
            currentCategories
              .map((category) => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td>{category.name}</td>
                  <td className="button-group">
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
              <td colSpan="3" style={{ textAlign: "center" }}>
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
