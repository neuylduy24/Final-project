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

    // 🔹 Lấy danh sách ID các truyện đã đọc gần đây nhất (loại trùng lặp)
    public List<String> getRecentlyReadBookIds(String email) {
        return readingHistoryRepository.findByEmailOrderByLastReadAtDesc(email).stream()
                .map(ReadingHistory::getBookId)
                .filter(id -> id != null && !id.isBlank())
                .distinct()
                .toList();
    }

    // 🔹 Bắt đầu hoặc tiếp tục đọc sách
    public ReadingHistory startOrUpdateReading(String email, String userId, String bookId, String chapterId, int progress, long timeSpent) {
        Optional<ReadingHistory> existingHistory = readingHistoryRepository.findTopByEmailAndBookIdAndChapterIdOrderByLastReadAtDesc(email, bookId, chapterId);

        if (existingHistory.isPresent()) {
            // If there's an existing history, update the progress
            ReadingHistory history = existingHistory.get();
            history.updateProgress(progress, timeSpent, chapterId);
            return readingHistoryRepository.save(history);
        } else {
            // If there's no existing history, start a new session for the given chapter
            ReadingHistory newHistory = ReadingHistory.startNewSession(email, userId, bookId, chapterId);
            return readingHistoryRepository.save(newHistory);
        }
    }


    // 🔹 Kết thúc một phiên đọc
    public void endReadingSession(String id) {
        Optional<ReadingHistory> history = readingHistoryRepository.findById(id);
        if (history.isPresent()) {
            history.get().endReadingSession();
            readingHistoryRepository.save(history.get());
        } else {
            // Log or throw exception
            throw new IllegalArgumentException("Reading history not found for id: " + id);
        }
    }

}
