import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import chapterService from "../../service/chapterService";

const ChapterForm = ({ 
    form, 
    setForm, 
    isEditing, 
    closeForm, 
    handleSubmit, 
    books 
}) => {
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploadType, setUploadType] = useState("file");
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);

    useEffect(() => {
        // Initialize image URLs if editing a chapter with existing images
        if (isEditing && form.images && form.images.length > 0) {
            setImageUrls(form.images);
        }
    }, [isEditing, form.images]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);
    };

    const handleUrlChange = (e, index) => {
        const newUrls = [...imageUrls];
        newUrls[index] = e.target.value;
        setImageUrls(newUrls);
    };

    const addUrlField = () => {
        setImageUrls([...imageUrls, ""]);
    };

    const removeUrlField = (index) => {
        const newUrls = [...imageUrls];
        newUrls.splice(index, 1);
        setImageUrls(newUrls);
    };

    const renderImageInput = () => {
        if (uploadType === "url") {
            return (
                <div className="form-group">
                    <label>Image URLs:</label>
                    {imageUrls.map((url, index) => (
                        <div key={index} className="url-input-container">
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => handleUrlChange(e, index)}
                                placeholder="Enter image URL"
                            />
                            <button
                                type="button"
                                className="remove-url"
                                onClick={() => removeUrlField(index)}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        className="add-url"
                        onClick={addUrlField}
                    >
                        Add URL
                    </button>
                </div>
            );
        } else {
            return (
                <div className="form-group">
                    <label htmlFor="images">Upload Images:</label>
                    <input
                        type="file"
                        id="images"
                        name="images"
                        onChange={handleFileChange}
                        multiple
                        accept="image/*"
                    />
                    {selectedFiles.length > 0 && (
                        <div className="selected-files">
                            <p>Selected files:</p>
                            <ul>
                                {selectedFiles.map((file, index) => (
                                    <li key={index}>{file.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            );
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form
        if (!form.bookId) {
            setError("Please select a book");
            return;
        }
        
        if (!form.chapterNumber) {
            setError("Please enter a chapter number");
            return;
        }
        
        if (!form.title) {
            setError("Please enter a title");
            return;
        }
        
        if (!form.content) {
            setError("Please enter content");
            return;
        }
        
        try {
            setLoading(true);
            
            // Prepare chapter data
            const chapterData = {
                bookId: form.bookId,
                chapterNumber: parseFloat(form.chapterNumber), // Use parseFloat to match backend Double type
                title: form.title,
                content: form.content,
                views: form.views || 0,
                // Set createdAt with Vietnam timezone (UTC+7)
                createdAt: isEditing ? form.createdAt : new Date(new Date().getTime() + (7 * 60 * 60 * 1000)).toISOString()
            };
            
            // Handle images
            if (uploadType === 'file' && selectedFiles.length > 0) {
                try {
                    // In a real implementation, you would upload the files to a server
                    // and get back URLs. For now, we'll use mock URLs
                    const uploadedUrls = await Promise.all(
                        selectedFiles.map(async (file) => {
                            // This is a placeholder. In a real app, you would upload to a server
                            const formData = new FormData();
                            formData.append('file', file);
                            
                            // Mock URL for demonstration
                            return URL.createObjectURL(file);
                        })
                    );
                    
                    chapterData.images = uploadedUrls;
                    
                } catch (error) {
                    console.error("Error uploading images:", error);
                    setError("Unable to upload images. Please try again later.");
                    setLoading(false);
                    return;
                }
            } else if (uploadType === 'url' && imageUrls.length > 0) {
                chapterData.images = imageUrls.filter(url => url.trim() !== '');
            } else if (form.images && form.images.length > 0) {
                chapterData.images = form.images;
            } else {
                chapterData.images = [];
            }
            
            if (isEditing) {
                // Update existing chapter
                await chapterService.updateChapter(form.id, chapterData);
                toast.success("Chapter updated successfully!");
            } else {
                // Create new chapter
                await chapterService.createChapter(chapterData);
                toast.success("New chapter added successfully!");
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
            console.error("Error saving chapter:", error);
        } finally {
            setLoading(false);
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
                                step="0.1" // Allow decimal values like 1.0, 1.5, etc.
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
                            <button type="submit" className="save" disabled={loading}>
                                {loading ? 'Processing...' : isEditing ? 'Update Chapter' : 'Add Chapter'}
                            </button>
                            <button type="button" className="cancel" onClick={closeForm} disabled={loading}>
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