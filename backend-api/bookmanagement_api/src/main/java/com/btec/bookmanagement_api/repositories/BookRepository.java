package com.btec.bookmanagement_api.repositories;

import com.btec.bookmanagement_api.entities.Book;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends MongoRepository<Book, String> {

    Optional<Book> findByTitle(String title);
    Optional<Book> findByImageHash(String imageHash);

    List<Book> findByAuthor(String author);

    // Tìm theo từ khoá trong title hoặc description
    List<Book> findByTitleContainingIgnoreCase(String keyword);
    List<Book> findByDescriptionContainingIgnoreCase(String keyword);

    // Full-text search (nếu đã tạo text index trong MongoDB)
    @Query("{ $text: { $search: ?0 } }")
    List<Book> searchBooks(String keyword);

    // Lấy sách theo danh sách tiêu đề
    List<Book> findByTitleIn(List<String> titles);

    // Lấy sách theo danh sách tên thể loại
    @Query("{ 'categories.name': { $in: ?0 } }")
    List<Book> findByCategoryNames(List<String> categoryNames);

    // Sách mới nhất
    List<Book> findAllByOrderByCreatedAtDesc();

    // Ngẫu nhiên n sách
    @Aggregation(pipeline = {
            "{ $sample: { size: ?0 } }"
    })
    List<Book> findRandomBooks(int size);

    // Top 8 hoặc top 10 sách có lượt xem nhiều nhất
    List<Book> findTop8ByOrderByViewsDesc();
    List<Book> findTop10ByOrderByViewsDesc();

    // Toàn bộ sách sắp xếp theo view giảm dần
    List<Book> findAllByOrderByViewsDesc();

    // Gợi ý các sách cùng thể loại nhưng không trùng ID (ví dụ loại trừ sách đã đọc)
    @Query("{ 'categories.name': { $in: ?0 }, '_id': { $ne: ?1 } }")
    List<Book> findByCategoryNamesAndIdNot(List<String> categoryNames, String excludeBookId);
}
