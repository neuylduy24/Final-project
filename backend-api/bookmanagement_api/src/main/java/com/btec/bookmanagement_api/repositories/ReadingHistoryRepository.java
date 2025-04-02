package com.btec.bookmanagement_api.repositories;

import com.btec.bookmanagement_api.entities.ReadingHistory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReadingHistoryRepository extends MongoRepository<ReadingHistory, String> {

    // 🔹 Lấy danh sách lịch sử đọc của một người dùng
    List<ReadingHistory> findByEmailOrderByLastReadAtDesc(String email);

    // 🔹 Lấy lịch sử đọc mới nhất của một cuốn sách
    Optional<ReadingHistory> findTopByEmailAndBookIdOrderByLastReadAtDesc(String email, String bookId);
}
