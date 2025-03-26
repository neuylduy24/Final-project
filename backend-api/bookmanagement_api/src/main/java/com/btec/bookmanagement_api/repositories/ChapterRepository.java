package com.btec.bookmanagement_api.repositories;

import com.btec.bookmanagement_api.entities.Chapter;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChapterRepository extends MongoRepository<Chapter, String> {
    List<Chapter> findByBookId(String bookId);
    Optional<Chapter> findByBookIdAndChapterNumber(String bookId, int chapterNumber);
    List<Chapter> findAllByOrderByCreatedAtDesc();
    List<Chapter> findTop5ByOrderByCreatedAtDesc(); // Get the latest 5 chapters
}
