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

    @GetMapping
    public List<Feedback> getAllFeedbacks() {
        return feedbackService.getAllFeedbacks();
    }

    @GetMapping("/book/{bookId}")
    public List<Feedback> getFeedbacksByBookId(@PathVariable String bookId) {
        return feedbackService.getFeedbacksByBookId(bookId);
    }

    @GetMapping("/user/{userId}")
    public List<Feedback> getFeedbacksByUserId(@PathVariable String userId) {
        return feedbackService.getFeedbacksByUserId(userId);
    }

    @PostMapping
    public ResponseEntity<Feedback> addFeedback(@RequestBody Feedback feedback) {
        try {
            return ResponseEntity.ok(feedbackService.addFeedback(feedback));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFeedback(@PathVariable String id) {
        feedbackService.deleteFeedback(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/book/{bookId}/average-rating")
    public ResponseEntity<Double> getAverageRating(@PathVariable String bookId) {
        return ResponseEntity.ok(feedbackService.getAverageRating(bookId));
    }
}