// src/pages/ChooseCategoriesPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./choose.scss"; // CSS tùy chỉnh
import { ROUTERS } from "utils/path";

const ChooseCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token"); // Lấy token từ localStorage

  useEffect(() => {
    axios
      .get("https://api.it-ebook.io.vn/api/categories")
      .then((res) => setCategories(res.data))
      .catch(() => toast.error("Lỗi khi tải danh sách thể loại"));
  }, []);

  const toggleCategory = (id) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (!token) {
      toast.error("Bạn cần đăng nhập để lưu thể loại.");
      return;
    }

    if (selectedCategoryIds.length === 0) {
      toast.warning("Vui lòng chọn ít nhất một thể loại.");
      return;
    }

    // Gửi trực tiếp mảng các id mà không cần tên
    axios
      .post(
        "https://api.it-ebook.io.vn/api/users/favorite-categories",
        {
          favoriteCategories: selectedCategoryIds, // Chỉ gửi mảng id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        toast.success("Đã lưu thể loại yêu thích!");
        navigate(ROUTERS.USER.HOME); // Điều hướng về trang chính sau khi lưu thành công
      })
      .catch((error) => {
        const msg =
          error.response?.data?.message ||
          "Lỗi không xác định khi lưu thể loại.";
        toast.error("Lỗi: " + msg);
      });
  };

  return (
    <div className="choose-categories-page">
  <h2 className="question-title">What categories do you like best?</h2>
  <div className="categories-grid">
    {categories.map((cat) => (
      <div
        key={cat.id}
        className={`category-card ${
          selectedCategoryIds.includes(cat.name) ? "selected active" : ""
        }`}
        onClick={() => toggleCategory(cat.name)}
      >
        <span>{cat.name}</span>
      </div>
    ))}
  </div>
  <div className="submit-section">
    <button onClick={handleSubmit} className="submit-button">
      Submit
    </button>
  </div>
</div>

  );
};

export default ChooseCategoriesPage;
