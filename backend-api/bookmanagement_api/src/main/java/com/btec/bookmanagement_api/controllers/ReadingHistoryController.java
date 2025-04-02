package com.btec.bookmanagement_api.controllers;

import com.btec.bookmanagement_api.entities.ReadingHistory;
import com.btec.bookmanagement_api.services.ReadingHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reading-history")
@RequiredArgsConstructor
public class ReadingHistoryController {

    private final ReadingHistoryService readingHistoryService;

    // 🔹 Lấy lịch sử đọc của người dùng
    @GetMapping("/{email}")
    public ResponseEntity<List<ReadingHistory>> getUserReadingHistory(@PathVariable String email) {
        return ResponseEntity.ok(readingHistoryService.getUserReadingHistory(email));
    }

    // 🔹 Bắt đầu hoặc cập nhật tiến trình đọc
    @PostMapping("/start")
    public ResponseEntity<ReadingHistory> startOrUpdateReading(@RequestBody ReadingHistory history) {
        return ResponseEntity.ok(readingHistoryService.startOrUpdateReading(
                history.getEmail(), history.getUserId(), history.getBookId(), history.getProgress(), history.getTimeSpent()
        ));
    }
}
