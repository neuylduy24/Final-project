package com.btec.bookmanagement_api.controllers;

import com.btec.bookmanagement_api.entities.Feedback;
import com.btec.bookmanagement_api.services.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedbacks")
public class FeedbackController {
    @Autowired
    private FeedbackService feedbackService;

    // ✅ Lấy danh sách comment theo bookId
    @GetMapping("/comments/{bookId}")
    public ResponseEntity<List<Feedback>> getComments(@PathVariable String bookId) {
        return ResponseEntity.ok(feedbackService.getCommentsByBookId(bookId));
    }

    // ✅ Lấy danh sách rating theo bookId
    @GetMapping("/ratings/{bookId}")
    public ResponseEntity<List<Feedback>> getRatings(@PathVariable String bookId) {
        return ResponseEntity.ok(feedbackService.getRatingsByBookId(bookId));
    }

    // ✅ Lấy điểm trung bình rating theo bookId
    @GetMapping("/average-rating/{bookId}")
    public ResponseEntity<Double> getAverageRating(@PathVariable String bookId) {
        return ResponseEntity.ok(feedbackService.getAverageRating(bookId));
    }

    // ✅ Thêm mới feedback (comment hoặc rating)
    @PostMapping
    public ResponseEntity<Feedback> createFeedback(@RequestBody Feedback feedback) {
        return ResponseEntity.ok(feedbackService.createFeedback(feedback));
    }

    // ✅ Cập nhật feedback
    @PutMapping("/{id}")
    public ResponseEntity<Feedback> updateFeedback(@PathVariable String id, @RequestBody Feedback updatedFeedback) {
        return feedbackService.updateFeedback(id, updatedFeedback)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Xóa feedback
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFeedback(@PathVariable String id) {
        feedbackService.deleteFeedback(id);
        return ResponseEntity.noContent().build();
    }
}