package com.btec.bookmanagement_api.repositories;

import com.btec.bookmanagement_api.entities.ReadingHistory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReadingHistoryRepository extends MongoRepository<ReadingHistory, String> {

    // 🔹 Find reading history by user email, ordered by the last reading timestamp
    List<ReadingHistory> findByEmailOrderByLastReadAtDesc(String email);

    // 🔹 Find the latest reading session for a user and a specific book
    Optional<ReadingHistory> findTopByEmailAndBookIdOrderByLastReadAtDesc(String email, String bookId);

    // 🔹 Find the latest reading session for a user, a specific book, and chapter
    Optional<ReadingHistory> findTopByEmailAndBookIdAndChapterIdOrderByLastReadAtDesc(String email, String bookId, String chapterId);

    // 🔹 Find all reading history entries for a specific book
    List<ReadingHistory> findByBookId(String bookId);

    // 🔹 Find all reading history entries for a specific chapter
    List<ReadingHistory> findByChapterId(String chapterId);
}
