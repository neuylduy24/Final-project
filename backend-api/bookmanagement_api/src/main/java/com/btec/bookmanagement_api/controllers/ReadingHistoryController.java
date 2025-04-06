package com.btec.bookmanagement_api.controllers;

import com.btec.bookmanagement_api.entities.ReadingHistory;
import com.btec.bookmanagement_api.services.ReadingHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reading-history")
@RequiredArgsConstructor
public class ReadingHistoryController {

    private final ReadingHistoryService readingHistoryService;

    // 🔹 Lấy lịch sử đọc của người dùng
    @GetMapping("/user/{email}")
    public ResponseEntity<List<ReadingHistory>> getUserReadingHistory(@PathVariable String email) {
        List<ReadingHistory> readingHistories = readingHistoryService.getUserReadingHistory(email);
        return new ResponseEntity<>(readingHistories, HttpStatus.OK);
    }

    // 🔹 Bắt đầu hoặc tiếp tục đọc sách
    @PostMapping("/start-or-update")
    public ResponseEntity<ReadingHistory> startOrUpdateReading(
            @RequestParam String email,
            @RequestParam String userId,
            @RequestParam String bookId,
            @RequestParam String chapterId,
            @RequestParam int progress,
            @RequestParam long timeSpent) {

        ReadingHistory updatedHistory = readingHistoryService.startOrUpdateReading(email, userId, bookId, chapterId, progress, timeSpent);
        return new ResponseEntity<>(updatedHistory, HttpStatus.OK);
    }

    // 🔹 Kết thúc một phiên đọc
    @PostMapping("/end/{id}")
    public ResponseEntity<String> endReadingSession(@PathVariable String id) {
        try {
            readingHistoryService.endReadingSession(id);
            return new ResponseEntity<>("Reading session ended successfully.", HttpStatus.OK);
        } catch (IllegalArgumentException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
}
