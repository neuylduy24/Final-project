import React, { useState, useEffect } from 'react';
import bookService from '../../service/bookService';

const ChapterForm = ({ form, setForm, handleSubmit, closeForm, isEditing }) => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [uploadType, setUploadType] = useState('url'); // 'url' hoặc 'file'
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);

    useEffect(() => {
        fetchBooks();
    }, []);

    useEffect(() => {
        // Xóa preview URLs khi component unmount
        return () => {
            previewUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [previewUrls]);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const data = await bookService.getAllBooks();
            setBooks(data);
            setError(null);
        } catch (err) {
            setError("Không thể tải danh sách sách");
            console.error("Error fetching books:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        
        if (files.length === 0) return;
        
        // Tạo preview URLs cho các files đã chọn
        const newPreviewUrls = files.map(file => URL.createObjectURL(file));
        
        setSelectedFiles(files);
        setPreviewUrls(prevUrls => {
            // Xóa các URL cũ để tránh memory leak
            prevUrls.forEach(url => URL.revokeObjectURL(url));
            return newPreviewUrls;
        });
    };

    const renderImageInput = () => {
        if (uploadType === 'url') {
            return (
                <div className="form-group">
                    <label htmlFor="images">Hình ảnh (URL, phân tách bằng dấu phẩy):</label>
                    <input
                        type="text"
                        id="images"
                        name="images"
                        value={form.images ? form.images.join(', ') : ''}
                        onChange={(e) => {
                            const imageUrls = e.target.value.split(',').map(url => url.trim());
                            setForm(prev => ({
                                ...prev,
                                images: imageUrls.filter(url => url !== '')
                            }));
                        }}
                        placeholder="Nhập URL hình ảnh, phân tách bằng dấu phẩy"
                    />
                </div>
            );
        } else {
            return (
                <div className="form-group">
                    <label htmlFor="fileImages">Tải lên hình ảnh:</label>
                    <input
                        type="file"
                        id="fileImages"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        className="file-input"
                    />
                    {previewUrls.length > 0 && (
                        <div className="image-previews">
                            {previewUrls.map((url, index) => (
                                <div key={index} className="image-preview">
                                    <img src={url} alt={`Preview ${index}`} />
                                    <button 
                                        type="button" 
                                        className="remove-image"
                                        onClick={() => {
                                            setPreviewUrls(prevUrls => {
                                                const newUrls = [...prevUrls];
                                                URL.revokeObjectURL(newUrls[index]);
                                                newUrls.splice(index, 1);
                                                return newUrls;
                                            });
                                            setSelectedFiles(prevFiles => {
                                                const newFiles = [...prevFiles];
                                                newFiles.splice(index, 1);
                                                return newFiles;
                                            });
                                        }}
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
      
        if (!form.bookId) {
          console.error("❌ Thiếu bookId");
          return;
        }
      
        try {
          console.log("🚀 Gửi dữ liệu chương:", form);
      
          await bookService.addChapter(form.bookId, {
            chapterNumber: form.chapterNumber,
            title: form.title,
            content: form.content,
            images: form.images,
          });
      
          console.log("✅ Thêm chương thành công!");
        } catch (error) {
          console.error("❌ Lỗi khi thêm chương:", error.response?.data || error.message);
        }
      };
      
    

    return (
        <div className="form-overlay">
            <div className="form-container">
                <h3>{isEditing ? 'Chỉnh sửa chương' : 'Thêm chương mới'}</h3>
                <form onSubmit={handleFormSubmit}>
                    <div className="form-group">
                        <label htmlFor="bookId">Chọn sách:</label>
                        <select
                            id="bookId"
                            name="bookId"
                            value={form.bookId || ''}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        >
                            <option value="">-- Chọn sách --</option>
                            {books.map(book => (
                                <option key={book.id} value={book.id}>
                                    {book.title}
                                </option>
                            ))}
                        </select>
                        {loading && <span className="loading-text">Đang tải danh sách sách...</span>}
                        {error && <span className="error-text">{error}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="chapterNumber">Số chương:</label>
                        <input
                            type="number"
                            id="chapterNumber"
                            name="chapterNumber"
                            value={form.chapterNumber || ''}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.1"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="title">Tiêu đề:</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={form.title || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="content">Nội dung:</label>
                        <textarea
                            id="content"
                            name="content"
                            value={form.content || ''}
                            onChange={handleChange}
                            required
                            rows="10"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Phương thức tải ảnh:</label>
                        <div className="upload-type-options">
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="uploadType"
                                    value="url"
                                    checked={uploadType === 'url'}
                                    onChange={() => setUploadType('url')}
                                />
                                Từ URL
                            </label>
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="uploadType"
                                    value="file"
                                    checked={uploadType === 'file'}
                                    onChange={() => setUploadType('file')}
                                />
                                Từ máy tính
                            </label>
                        </div>
                    </div>
                    
                    {renderImageInput()}
                    
                    <div className="form-buttons">
                        <button type="submit" className="btn-submit">
                            {isEditing ? 'Cập nhật' : 'Thêm mới'}
                        </button>
                        <button type="button" className="btn-cancel" onClick={closeForm}>
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChapterForm;
