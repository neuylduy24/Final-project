package com.btec.bookmanagement_api.services;

import com.btec.bookmanagement_api.entities.BookMark;
import com.btec.bookmanagement_api.repositories.BookMarkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookMarkService {
    @Autowired
    private BookMarkRepository bookmarkRepository;

    public List<BookMark> getBookmarksByUserId(String userId) {
        return bookmarkRepository.findByUserId(userId);
    }

    public Optional<BookMark> getBookmarkByUserAndBook(String userId, String bookId) {
        return bookmarkRepository.findByUserIdAndBookId(userId, bookId);
    }

    public BookMark createBookmark(BookMark bookmark) {
        // Check if a bookmark for this book already exists for the user
        Optional<BookMark> existingBookmark = bookmarkRepository.findByUserIdAndBookId(bookmark.getUserId(), bookmark.getBookId());
        if (existingBookmark.isPresent()) {
            throw new RuntimeException("Bookmark for this book already exists!");
        }
        return bookmarkRepository.save(bookmark);
    }

    public void deleteBookmark(String id) {
        bookmarkRepository.deleteById(id);
    }

    public void deleteBookmarkByUserAndBook(String userId, String bookId) {
        bookmarkRepository.deleteByUserIdAndBookId(userId, bookId);
    }
}
