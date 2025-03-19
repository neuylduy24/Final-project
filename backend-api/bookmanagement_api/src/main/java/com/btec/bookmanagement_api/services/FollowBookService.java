package com.btec.bookmanagement_api.services;

import com.btec.bookmanagement_api.entities.FollowBook;
import com.btec.bookmanagement_api.repositories.FollowBookRepository;
import com.btec.bookmanagement_api.repositories.BookRepository;
import com.btec.bookmanagement_api.repositories.ChapterRepository;
import com.btec.bookmanagement_api.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FollowBookService {
    @Autowired
    private FollowBookRepository followBookRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BookRepository bookRepository;
    @Autowired
    private ChapterRepository chapterRepository;

    public List<FollowBook> getFollowBookByUserId(String userId) {
        return followBookRepository.findByUserId(userId);
    }

    public Optional<FollowBook> getFollowBookByUserAndBook(String userId, String bookId) {
        return followBookRepository.findByUserIdAndBookId(userId, bookId);
    }

    public FollowBook createFollowBook(FollowBook bookmark) {
        // Check if a bookmark for this book already exists for the user
        Optional<FollowBook> existingBookmark = followBookRepository.findByUserIdAndBookId(bookmark.getUserId(), bookmark.getBookId());
        if (existingBookmark.isPresent()) {
            throw new RuntimeException("Bookmark for this book already exists!");
        }
        return followBookRepository.save(bookmark);
    }

    public void deleteFollowBook(String id) {
        followBookRepository.deleteById(id);
    }

    public void deleteFollowBookByUserAndBook(String userId, String bookId) {
        followBookRepository.deleteByUserIdAndBookId(userId, bookId);
    }
}
