import React, { useState, useEffect } from 'react';
import bookService from '../../service/bookService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChapterForm = ({ form, setForm, handleSubmit, closeForm, isEditing }) => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [uploadType, setUploadType] = useState('url'); // 'url' or 'file'
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchBooks();
    }, []);

    useEffect(() => {
        // Clear preview URLs when component unmounts
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
            setError("Unable to load book list");
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
        
        // Create preview URLs for selected files
        const newPreviewUrls = files.map(file => URL.createObjectURL(file));
        
        setSelectedFiles(files);
        setPreviewUrls(prevUrls => {
            // Clear old URLs to avoid memory leak
            prevUrls.forEach(url => URL.revokeObjectURL(url));
            return newPreviewUrls;
        });
    };

    const renderImageInput = () => {
        if (uploadType === 'url') {
            return (
                <div className="form-group">
                    <label htmlFor="images">Images (URLs, comma-separated):</label>
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
                        placeholder="Enter image URLs, separated by commas"
                    />
                </div>
            );
        } else {
            return (
                <div className="form-group">
                    <label htmlFor="fileImages">Upload Images:</label>
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
        
        // Validate required fields
        if (!form.bookId) {
            toast.error("Please select a book");
            return;
        }

        if (!form.chapterNumber) {
            toast.error("Please enter chapter number");
            return;
        }

        if (!form.title) {
            toast.error("Please enter chapter title");
            return;
        }

        if (!form.content) {
            toast.error("Please enter chapter content");
            return;
        }

        // Validate images based on upload type
        if (uploadType === 'url' && (!form.images || form.images.length === 0)) {
            toast.error("Please enter at least one image URL");
            return;
        }

        if (uploadType === 'file' && selectedFiles.length === 0) {
            toast.error("Please select at least one image file");
            return;
        }
        
        try {
            // Ensure chapterNumber is an integer
            const chapterData = {
                chapterNumber: parseInt(form.chapterNumber),
                title: form.title,
                content: form.content,
                views: 0,
                bookId: null,  // Default value is null according to Postman
                createdAt: isEditing ? form.createdAt : null  // Default value is null according to Postman
            };
            
            // Add createdAt as current time in Vietnam timezone
            const now = new Date();
            // Adjust to Vietnam timezone (UTC+7)
            const vietnamTime = new Date(now.getTime() + (7 * 60 * 60 * 1000));
            
            if (isEditing) {
                // If editing, keep old createdAt
                chapterData.createdAt = form.createdAt;
            } else {
                // If adding new, set current time in Vietnam timezone
                chapterData.createdAt = vietnamTime.toISOString();
            }
            
            // Handle images
            if (uploadType === 'file' && selectedFiles.length > 0) {
                try {
                    // Assuming we're using a mock image upload function (need to replace with actual function)
                    const uploadedUrls = await Promise.all(
                        selectedFiles.map(async (file) => {
                            // Mock image upload - in reality, need to replace with real API
                            const formData = new FormData();
                            formData.append('file', file);
                            
                            // Assuming we're calling an image upload API
                            // const response = await axios.post('your-upload-api-endpoint', formData);
                            // return response.data.url;
                            
                            // In this example, we just return a mock URL
                            return URL.createObjectURL(file); // In reality, will return URL from server
                        })
                    );
                    
                    // Add image URLs to chapterData
                    chapterData.images = uploadedUrls;
                    
                } catch (error) {
                    console.error("Error uploading images:", error);
                    setError("Unable to upload images. Please try again later.");
                    return;
                }
            } else if (form.images && form.images.length > 0) {
                chapterData.images = form.images;
            } else {
                chapterData.images = null; // Default value is null according to Postman
            }
            
            if (isEditing) {
                // Update chapter
                await bookService.updateChapterInBook(form.bookId, form.id, chapterData);
            } else {
                // Add new chapter to book
                await bookService.addChapterToBook(form.bookId, chapterData);
            }
            
            // Reset form
            setForm({
                bookId: "",
                chapterNumber: "",
                title: "",
                content: "",
                images: []
            });
            
            // Display success message
            setSuccessMessage(isEditing ? 'Chapter updated successfully!' : 'New chapter added successfully!');
            
            // Close form after success
            setTimeout(() => {
                setSuccessMessage('');
                closeForm();
            }, 2000);
            
            // Call handleSubmit to notify parent component
            handleSubmit(e, true);
            
        } catch (error) {
            toast.error(isEditing ? 'Unable to update chapter: ' + error.message : 'Unable to add new chapter: ' + error.message);
        }
    };

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
            <div className="form-overlay">
                <div className="form-container">
                    <h3>{isEditing ? 'Edit Chapter' : 'Add New Chapter'}</h3>
                    {successMessage && <div className="success-message">{successMessage}</div>}
                    {error && <div className="error-message">{error}</div>}
                    
                    <form onSubmit={handleFormSubmit}>
                        <div className="form-group">
                            <label htmlFor="bookId">Select Book:</label>
                            <select
                                id="bookId"
                                name="bookId"
                                value={form.bookId || ''}
                                onChange={handleChange}
                                disabled={loading || isEditing}
                            >
                                <option value="">-- Select a book --</option>
                                {books.map(book => (
                                    <option key={book.id} value={book.id}>
                                        {book.title}
                                    </option>
                                ))}
                            </select>
                            {loading && <span className="loading-text">Loading book list...</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="chapterNumber">Chapter Number:</label>
                            <input
                                type="number"
                                id="chapterNumber"
                                name="chapterNumber"
                                value={form.chapterNumber || ''}
                                onChange={handleChange}
                                min="1"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="title">Title:</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={form.title || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="content">Content:</label>
                            <textarea
                                id="content"
                                name="content"
                                value={form.content || ''}
                                onChange={handleChange}
                                rows="5"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Image Upload Type:</label>
                            <div className="image-input-type-selector">
                                <label className={uploadType === "url" ? "active" : ""}>
                                    <input
                                        type="radio"
                                        name="uploadType"
                                        value="url"
                                        checked={uploadType === "url"}
                                        onChange={(e) => setUploadType(e.target.value)}
                                    />
                                    Enter Image URL
                                </label>
                                <label className={uploadType === "file" ? "active" : ""}>
                                    <input
                                        type="radio"
                                        name="uploadType"
                                        value="file"
                                        checked={uploadType === "file"}
                                        onChange={(e) => setUploadType(e.target.value)}
                                    />
                                    Upload Image
                                </label>
                            </div>
                        </div>
                        
                        {renderImageInput()}
                        
                        <div className="form-actions">
                            <button type="submit" className="save">
                                {isEditing ? 'Update Chapter' : 'Add Chapter'}
                            </button>
                            <button type="button" className="cancel" onClick={closeForm}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ChapterForm;
