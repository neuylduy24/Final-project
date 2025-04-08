package com.btec.bookmanagement_api.services;

import com.btec.bookmanagement_api.entities.ReadingHistory;
import com.btec.bookmanagement_api.repositories.ReadingHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReadingHistoryService {

    private final ReadingHistoryRepository readingHistoryRepository;

    public List<ReadingHistory> getUserReadingHistory(String email) {
        return readingHistoryRepository.findByEmailOrderByLastReadAtDesc(email);
    }

    public ReadingHistory startOrUpdateReading(String email, String userId, String bookId, String chapterId, int progress, long timeSpent) {
        Optional<ReadingHistory> existingHistory =
                readingHistoryRepository.findTopByEmailAndBookIdAndChapterIdOrderByLastReadAtDesc(email, bookId, chapterId);

        if (existingHistory.isPresent()) {
            ReadingHistory history = existingHistory.get();
            history.updateProgress(progress, timeSpent, chapterId);
            return readingHistoryRepository.save(history);
        } else {
            ReadingHistory newHistory = ReadingHistory.startNewSession(email, userId, bookId, chapterId);
            return readingHistoryRepository.save(newHistory);
        }
    }

    public void endReadingSession(String id) {
        Optional<ReadingHistory> history = readingHistoryRepository.findById(id);
        if (history.isPresent()) {
            history.get().endReadingSession();
            readingHistoryRepository.save(history.get());
        } else {
            throw new IllegalArgumentException("Reading history not found for id: " + id);
        }
    }
}