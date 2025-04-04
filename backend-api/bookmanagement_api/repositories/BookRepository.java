package com.btec.bookmanagement_api.repositories;

import com.btec.bookmanagement_api.entities.Book;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends MongoRepository<Book, String> {
    Optional<Book> findByTitle(String title);
    List<Book> findByAuthorId(String authorId);
    @Query("{ $text: { $search: ?0 } }")
    List<Book> searchBooks(String keyword);
    List<Book> findByTitleContainingIgnoreCase(String title);
    List<Book> findAllByOrderByCreatedAtDesc();

}
