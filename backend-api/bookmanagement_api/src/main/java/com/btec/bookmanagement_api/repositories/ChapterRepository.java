package com.btec.bookmanagement_api.repositories;

import com.btec.bookmanagement_api.entities.Chapter;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChapterRepository extends MongoRepository<Chapter, String> {
    List<Chapter> findByBookId(String bookId);
    Optional<Chapter> findByBookIdAndChapterNumber(String bookId, int chapterNumber);
    // Lấy tất cả chương, sắp xếp theo ngày tạo giảm dần
    List<Chapter> findAllByOrderByCreatedDesc();

    // Nếu muốn lấy chương theo bookId và sắp xếp theo ngày tạo
    List<Chapter> findByBookIdOrderByCreatedDesc(String bookId);
}
