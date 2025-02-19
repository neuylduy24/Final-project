package com.btec.bookmanagement_api.repositories;

import com.btec.bookmanagement_api.entities.BookMark;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookMarkRepository extends MongoRepository<BookMark, String> {
    List<BookMark> findByUserId(String userId);
    Optional<BookMark> findByUserIdAndBookId(String userId, String bookId);
    void deleteByUserIdAndBookId(String userId, String bookId);
}
