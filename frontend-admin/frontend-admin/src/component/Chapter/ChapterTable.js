import React, { useState, useEffect } from 'react';
import bookService from '../../service/bookService';
import Pagination from '../common/Pagination';

const ChapterTable = ({ chapters, handleEdit, handleDelete, setShowForm, selectedBookId }) => {
    const [bookTitles, setBookTitles] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filteredChapters, setFilteredChapters] = useState([]);
    const [books, setBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    useEffect(() => {
        fetchBooks();
    }, []);

    // Reset page when selectedBookId changes
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedBookId]);

    // Add useEffect to filter chapters when chapters or selectedBookId changes
    useEffect(() => {
        if (chapters && chapters.length > 0) {
            let filtered = chapters;
            
            if (selectedBookId && selectedBookId !== "all") {
                // Compare as strings
                filtered = chapters.filter(chapter => 
                    chapter.bookId.toString() === selectedBookId.toString()
                );
            }
            
            // Sort filtered chapters
            const sorted = [...filtered].sort((a, b) => {
                // Compare by bookId first as strings
                if (a.bookId !== b.bookId) {
                    return a.bookId.toString().localeCompare(b.bookId.toString());
                }
                // If same bookId, compare by chapterNumber
                return parseInt(a.chapterNumber) - parseInt(b.chapterNumber);
            });
            
            setFilteredChapters(sorted);
        } else {
            setFilteredChapters([]);
        }
    }, [chapters, selectedBookId]);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const data = await bookService.getAllBooks();
            setBooks(data);
            
            // Create mapping from bookId to bookTitle
            const titles = {};
            data.forEach(book => {
                titles[book.id] = book.title;
            });
            setBookTitles(titles);
            
            setError(null);
        } catch (err) {
            setError("Unable to load book information");
            console.error("Error fetching books:", err);
        } finally {
            setLoading(false);
        }
    };

    // Function to format chapter number
    const formatChapterNumber = (number) => {
        if (number === null || number === undefined) return 'N/A';
        
        // Always display chapter number as integer
        return parseInt(number).toString();
    };

    // Function to format creation date
    const formatCreatedDate = (dateString) => {
        if (!dateString) return 'N/A';
        
        try {
            // Handle both ISO string and timestamp cases
            const date = new Date(dateString);
            
            // Check if date is valid
            if (isNaN(date.getTime())) {
                return 'N/A';
            }
            
            // Format date in English format
            return new Intl.DateTimeFormat('en-US', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
        } catch (error) {
            console.error("Error formatting date:", error);
            return 'N/A';
        }
    };

    const handleEditChapter = (chapter) => {
        // Set chapter information in form for editing
        const chapterToEdit = {
            ...chapter,
            bookId: chapter.bookId // Ensure bookId is set correctly
        };
        handleEdit(chapterToEdit);
    };

    const handleDeleteChapter = (bookId, chapterId) => {
        // Call delete chapter function from parent component with string IDs
        handleDelete(bookId.toString(), chapterId.toString());
    };

    // Calculate pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredChapters.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredChapters.length / itemsPerPage);

    if (loading && books.length === 0) {
        return <div className="loading-container">Loading chapter list...</div>;
    }

    if (error) {
        return <div className="error-container">{error}</div>;
    }

    return (
        <div className="table-container">
            <div className="table-header">
                <h2>Chapter List</h2>
            </div>
            
            {filteredChapters.length === 0 ? (
                <div className="no-data">
                    {selectedBookId !== "all" 
                        ? "This book has no chapters yet. Please add new chapters." 
                        : "No chapters available. Please add new chapters."}
                </div>
            ) : (
                <>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Book Name</th>
                                <th>Chapter Number</th>
                                <th>Title</th>
                                <th>Views</th>
                                <th>Upload Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((chapter) => (
                                <tr key={`${chapter.bookId}-${chapter.id}`}>
                                    <td>{chapter.id}</td>
                                    <td>{chapter.bookTitle || bookTitles[chapter.bookId] || 'Not found'}</td>
                                    <td>{formatChapterNumber(chapter.chapterNumber)}</td>
                                    <td>{chapter.title}</td>
                                    <td>{chapter.views || 0}</td>
                                    <td>{formatCreatedDate(chapter.createdAt)}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn-edit"
                                                onClick={() => handleEditChapter(chapter)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn-delete"
                                                onClick={() => handleDeleteChapter(chapter.bookId, chapter.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {filteredChapters.length > itemsPerPage && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            setCurrentPage={setCurrentPage}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default ChapterTable;
