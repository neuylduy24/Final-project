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
    List<Book> findByAuthor(String author);
    @Query("{ $text: { $search: ?0 } }")
    List<Book> searchBooks(String keyword);

    List<Book> findByTitleContainingIgnoreCase(String title);
    List<Book> findByDescriptionContainingIgnoreCase(String title);
    Optional<Book> findByImageHash(String imageHash);
    List<Book> findAllByOrderByCreatedAtDesc();



    List<Book> findByTitleIn(List<String> titles);
    // Lấy 8 sách có lượt xem nhiều nhất
    List<Book> findTop8ByOrderByViewsDesc();

}
