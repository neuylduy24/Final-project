package com.btec.bookmanagement_api.repositories;

import com.btec.bookmanagement_api.entities.FollowBook;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

public interface FollowBookRepository extends MongoRepository<FollowBook, String> {

    List<FollowBook> findAll();
    List<FollowBook> findByUserId(String userId);
    Optional<FollowBook> findByUserIdAndBookId(String userId, String bookId);
    void deleteByUserIdAndBookId(String userId, String bookId);
}

    List<FollowBook> findByEmail(String email);
    Optional<FollowBook> findByEmailAndBookId(String email, String bookId);
    boolean existsByEmailAndBookId(String email, String bookId);
    void deleteByEmailAndBookId(String email, String bookId);
}

