package com.btec.bookmanagement_api.services;

import com.btec.bookmanagement_api.entities.ReadingHistory;
import com.btec.bookmanagement_api.repositories.ReadingHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReadingHistoryService {

    private final ReadingHistoryRepository readingHistoryRepository;

    // 🔹 Lấy lịch sử đọc của người dùng
    public List<ReadingHistory> getUserReadingHistory(String email) {
        return readingHistoryRepository.findByEmailOrderByLastReadAtDesc(email);
    }

    // 🔹 Bắt đầu hoặc tiếp tục đọc sách
    public ReadingHistory startOrUpdateReading(String email, String userId, String bookId, int progress, long timeSpent) {
        Optional<ReadingHistory> existingHistory = readingHistoryRepository.findTopByEmailAndBookIdOrderByLastReadAtDesc(email, bookId);

        if (existingHistory.isPresent()) {
            // 🔹 Nếu đã có lịch sử, cập nhật tiến trình đọc
            ReadingHistory history = existingHistory.get();
            history.updateProgress(progress, timeSpent);
            return readingHistoryRepository.save(history);
        } else {
            // 🔹 Nếu chưa có, tạo session mới
            ReadingHistory newHistory = ReadingHistory.startNewSession(email, userId, bookId);
            return readingHistoryRepository.save(newHistory);
        }
    }

    // 🔹 Kết thúc một phiên đọc
    public void endReadingSession(String id) {
        Optional<ReadingHistory> history = readingHistoryRepository.findById(id);
        history.ifPresent(h -> {
            h.endReadingSession();
            readingHistoryRepository.save(h);
        });
    }
}
