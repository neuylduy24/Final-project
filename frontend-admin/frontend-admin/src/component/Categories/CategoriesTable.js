<<<<<<< Updated upstream
import React from "react";
import "./styleForm.scss"
const CategoriesTable = ({ categories, handleEdit, handleDelete, setShowForm, setForm, setIsEditing }) => {
  return (
      <table className="categories-table">
=======
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
  const [isAdmin, setIsAdmin] = useState(false);

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
              ? Math.max(...categories.map((c) => c.id || "0")) + 1
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
        // Kiểm tra xem có đang cố gắng cập nhật thể loại "Kinh dị" không
        if (category.id === "") {
          toast.error("❌ Không thể cập nhật thể loại Kinh dị!");
          setShowForm(false);
          return;
        }
        
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
    // Kiểm tra xem đây có phải là thể loại "Kinh dị" với ID rỗng
    if (id === "") {
      toast.error("❌ Không thể xóa thể loại Kinh dị!");
      return;
    }
    
    try {
      // Gửi yêu cầu xóa lên API
      await axios.delete(`${API_URL}/${id}`);
  
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

  // Thêm hàm xóa đặc biệt cho thể loại có ID rỗng
  const handleForceDeleteEmptyId = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa thể loại Kinh dị? Hành động này có thể ảnh hưởng đến hệ thống!")) {
      try {
        // Gửi yêu cầu xóa đặc biệt cho ID rỗng
        // Lưu ý: API có thể cần được cấu hình đặc biệt để xử lý trường hợp này
        await axios.delete(`${API_URL}/empty`);
        
        // Cập nhật lại danh sách sau khi xóa
        setCategories((prevCategories) => prevCategories.filter((c) => c.id !== ""));
        
        toast.warning("🗑️ Đã xóa thể loại Kinh dị!");
      } catch (error) {
        toast.error("❌ Lỗi khi xóa thể loại Kinh dị!");
        console.error("Lỗi khi xóa thể loại:", error);
      }
    }
  };

  // Thêm chức năng bật/tắt quyền admin
  const toggleAdminMode = () => {
    setIsAdmin(!isAdmin);
    toast.info(isAdmin ? "Đã tắt chế độ Admin" : "Đã bật chế độ Admin");
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
      
      <div className="info-message" style={{ 
        marginBottom: '15px', 
        padding: '10px', 
        backgroundColor: '#f8f9fa', 
        border: '1px solid #d6d8db',
        borderRadius: '4px',
        color: '#383d41',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <p><b>Lưu ý:</b> Thể loại "Kinh dị" là thể loại mặc định và không thể sửa hoặc xóa.</p>
        <div>
          <button 
            onClick={toggleAdminMode} 
            style={{ 
              marginRight: '10px',
              padding: '5px 10px', 
              backgroundColor: isAdmin ? '#dc3545' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {isAdmin ? 'Tắt Admin' : 'Bật Admin'}
          </button>
          
          {isAdmin && (
            <button 
              onClick={handleForceDeleteEmptyId} 
              style={{ 
                padding: '5px 10px', 
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Xóa thể loại "Kinh dị"
            </button>
          )}
        </div>
      </div>
      
      <table className="container-table">
>>>>>>> Stashed changes
        <thead>
          <tr className="categories-title">
            <th>Id</th>
            <th>Tên thể loại</th>
            <th>Ngày tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
<<<<<<< Updated upstream
        {categories.length > 0 ? (
         categories.map((category) => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>{category.name}</td>
              <td>{category.createdAt}</td>
              <td className="button-group">
                <button className="add-button" onClick={() => {
                  setShowForm(true);
                  setForm({ id: "", name: "", createdAt: "" });
                  setIsEditing(false);
                }}>Thêm</button>
                <button className="edit-button" onClick={() => handleEdit(category)}>Sửa</button>
                <button className="delete-button" onClick={() => handleDelete(category.id)}>Xóa</button>
=======
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
                    className={`edit-button ${category.id === "" ? 'disabled-button' : ''}`}
                    onClick={() => {
                      // Kiểm tra xem đây có phải là thể loại "Kinh dị" không
                      if (category.id === "") {
                        toast.error("❌ Không thể sửa thể loại Kinh dị!");
                        return;
                      }
                      setSelectedCategory(category);
                      setShowForm(true);
                      setIsEditing(true);
                    }}
                    disabled={category.id === ""}
                    style={category.id === "" ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                  >
                    ✏️ Sửa
                  </button>
                  <button
                    className={`delete-button ${category.id === "" ? 'disabled-button' : ''}`}
                    onClick={() => handleDelete(category.id)}
                    disabled={category.id === ""}
                    style={category.id === "" ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
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
>>>>>>> Stashed changes
              </td>
            </tr>
          ))
        ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>Không có thể loại nào</td>
            </tr>
          )}
        </tbody>
      </table>
  );
};

export default CategoriesTable;
