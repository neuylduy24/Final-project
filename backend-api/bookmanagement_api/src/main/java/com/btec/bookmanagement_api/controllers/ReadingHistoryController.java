package com.btec.bookmanagement_api.controllers;

import com.btec.bookmanagement_api.dto.ReadingHistoryRequest;
import com.btec.bookmanagement_api.entities.ReadingHistory;
import com.btec.bookmanagement_api.services.ReadingHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reading-history")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReadingHistoryController {

    private final ReadingHistoryService readingHistoryService;

    @GetMapping("/user/{email}")
    public ResponseEntity<List<ReadingHistory>> getUserReadingHistory(@PathVariable String email) {
        return ResponseEntity.ok(readingHistoryService.getUserReadingHistory(email));
    }

    @PostMapping("/start-or-update")
    public ResponseEntity<ReadingHistory> startOrUpdateReading(@RequestBody ReadingHistoryRequest request) {
        ReadingHistory result = readingHistoryService.startOrUpdateReading(
                request.getEmail(),
                request.getUserId(),
                request.getBookId(),
                request.getChapterId(),
                request.getProgress(),
                request.getTimeSpent()
        );
        return ResponseEntity.ok(result);
    }

    @PostMapping("/end/{id}")
    public ResponseEntity<String> endReadingSession(@PathVariable String id) {
        try {
            readingHistoryService.endReadingSession(id);
            return ResponseEntity.ok("Reading session ended successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
}
