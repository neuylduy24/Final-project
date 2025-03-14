import React, { useState, useEffect } from "react";
import { getAllBooks } from "../../service/bookService";
import { createChapter, updateChapter } from "../../service/chapterService";
import { toast } from "react-toastify";

const ChapterForm = ({ chapter, setChapter, onSuccess, closeForm, isEditing }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getAllBooks();
        setBooks(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sách:", error);
        toast.error("Không thể lấy danh sách sách");
      }
    };

    fetchBooks();

    // Nếu đang chỉnh sửa, thiết lập danh sách hình ảnh
    if (isEditing && chapter.images) {
      setImages(chapter.images || []);
    }
  }, [isEditing, chapter.images]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Đảm bảo chapterNumber là số (double)
      const chapterNumberValue = parseFloat(chapter.chapterNumber);
      
      if (isNaN(chapterNumberValue)) {
        toast.error("Số chương phải là số hợp lệ");
        setLoading(false);
        return;
      }

      // Kiểm tra các trường bắt buộc
      if (!chapter.bookId) {
        toast.error("Vui lòng chọn sách");
        setLoading(false);
        return;
      }

      if (!chapter.title) {
        toast.error("Vui lòng nhập tiêu đề chương");
        setLoading(false);
        return;
      }
      
      // Tạo đối tượng dữ liệu đúng định dạng (chính xác với Entity trong backend)
      const chapterData = {
        bookId: chapter.bookId,
        chapterNumber: chapterNumberValue,
        title: chapter.title || "",
        content: chapter.content || "",
        images: images || []
        // Không truyền views và createdAt, để server quản lý
      };
      
      console.log("Sending chapter data:", chapterData); // Debugging line

      if (isEditing) {
        chapterData.id = chapter.id;
        console.log("Cập nhật chương:", chapterData);
        await updateChapter(chapter.id, chapterData);
        toast.success("Cập nhật chương thành công");
      } else {
        console.log("Tạo chương mới:", chapterData);
        await createChapter(chapterData);
        toast.success("Thêm chương mới thành công");
      }
      
      onSuccess();
      closeForm();
    } catch (error) {
      console.error("Lỗi khi lưu chương:", error);
      console.error("Chi tiết lỗi:", error.response?.data || error.message);
      
      // Hiển thị thông báo lỗi cụ thể nếu có
      if (error.response?.data?.message) {
        toast.error(`Lỗi: ${error.response.data.message}`);
      } else {
        toast.error(isEditing ? "Không thể cập nhật chương" : "Không thể thêm chương mới");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Ở đây chúng ta giả định rằng bạn sẽ upload ảnh và nhận về URL
      // Trong thực tế, bạn sẽ cần một API để upload ảnh và nhận về URL
      
      // Tạm thời sử dụng URL tạm để demo
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      
      // Trong thực tế, bạn sẽ upload ảnh lên server và nhận về URL thực
      // const uploadedImageUrl = await uploadImageToServer(file);
      // setImages([...images, uploadedImageUrl]);
    }
  };

  const addImageToList = () => {
    if (selectedImage) {
      setImages([...images, selectedImage]);
      setSelectedImage(null);
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  return (
    <div className="modal-overlay" onClick={closeForm}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="container-form">
          <h3>{isEditing ? "Cập nhật chương" : "Thêm mới chương"}</h3>
          
          <div className="form-group">
            <label>Chọn sách</label>
            <select
              name="bookId"
              value={chapter.bookId || ""}
              onChange={(e) => setChapter(prev => ({ ...prev, bookId: e.target.value }))}
              required
              disabled={isEditing} // Không cho phép thay đổi sách khi đang chỉnh sửa
            >
              <option value="">-- Chọn sách --</option>
              {books.map(book => (
                <option key={book.id} value={book.id}>{book.title}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Số chương</label>
            <input
              type="number"
              name="chapterNumber"
              step="0.1"
              placeholder="Số chương (vd: 1, 1.5)"
              value={chapter.chapterNumber || ""}
              onChange={(e) => setChapter(prev => ({ 
                ...prev, 
                chapterNumber: parseFloat(e.target.value) 
              }))}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Tiêu đề</label>
            <input
              name="title"
              placeholder="Tiêu đề chương"
              value={chapter.title || ""}
              onChange={(e) => setChapter(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Nội dung</label>
            <textarea
              name="content"
              placeholder="Nội dung chương"
              value={chapter.content || ""}
              onChange={(e) => setChapter(prev => ({ ...prev, content: e.target.value }))}
              rows={10}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Hình ảnh</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
            {selectedImage && (
              <div className="selected-image">
                <img src={selectedImage} alt="Selected" height="100" />
                <button type="button" onClick={addImageToList}>Thêm ảnh này</button>
              </div>
            )}
            
            <div className="image-preview">
              {images.map((img, index) => (
                <div key={index} className="image-item">
                  <img src={img} alt={`Ảnh ${index + 1}`} height="50" />
                  <button type="button" onClick={() => removeImage(index)}>Xóa</button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? "Đang xử lý..." : (isEditing ? "Cập nhật" : "Thêm mới")}
            </button>
            <button type="button" onClick={closeForm}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChapterForm;
