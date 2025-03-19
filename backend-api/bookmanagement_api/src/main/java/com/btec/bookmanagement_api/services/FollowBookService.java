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
    private final FollowBookRepository followBookRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final ChapterRepository chapterRepository;

    @Autowired
    public FollowBookService(FollowBookRepository followBookRepository, UserRepository userRepository,
                             BookRepository bookRepository, ChapterRepository chapterRepository) {
        this.followBookRepository = followBookRepository;
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
        this.chapterRepository = chapterRepository;
    }

    public List<FollowBook> getFollowBooksByUserId(String userId) {
        return followBookRepository.findByUserId(userId);
    }

    public Optional<FollowBook> getFollowBookByUserAndBook(String userId, String bookId) {
        return followBookRepository.findByUserIdAndBookId(userId, bookId);
    }

    public FollowBook createFollowBook(FollowBook followBook) {
        // Check if a FollowBook record already exists for the user and book
        Optional<FollowBook> existingFollowBook = followBookRepository.findByUserIdAndBookId(followBook.getUserId(), followBook.getBookId());
        if (existingFollowBook.isPresent()) {
            throw new RuntimeException("FollowBook record for this book already exists!");
        }
        return followBookRepository.save(followBook);
    }

    public void deleteFollowBook(String id) {
        followBookRepository.deleteById(id);
    }

    public void deleteFollowBookByUserAndBook(String userId, String bookId) {
        followBookRepository.deleteByUserIdAndBookId(userId, bookId);
    }
}
