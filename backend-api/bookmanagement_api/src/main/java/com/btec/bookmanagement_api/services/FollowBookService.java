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

    public List<FollowBook> getFollowBooksByEmail(String email) {
        return followBookRepository.findByEmail(email);
    }

    public Optional<FollowBook> getFollowBookByEmailAndBook(String email, String bookId) {
        return followBookRepository.findByEmailAndBookId(email, bookId);
    }

    public FollowBook createFollowBook(FollowBook followBook) {
        // Kiểm tra đã tồn tại chưa
        if (followBookRepository.existsByEmailAndBookId(
                followBook.getEmail(),
                followBook.getBookId())) {
            throw new RuntimeException("Bạn đã theo dõi truyện này rồi");
        }
        return followBookRepository.save(followBook);
    }

    public void deleteFollowBook(String id) {
        followBookRepository.deleteById(id);
    }

    public void deleteFollowBookByEmailAndBook(String email, String bookId) {
        followBookRepository.deleteByEmailAndBookId(email, bookId);
    }
}
