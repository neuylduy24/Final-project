package com.btec.bookmanagement_api.services;

import com.btec.bookmanagement_api.entities.Feedback;
import com.btec.bookmanagement_api.repositories.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeedbackService {
    @Autowired
    private FeedbackRepository feedbackRepository;

    public List<Feedback> getAllFeedbacks() {
        return feedbackRepository.findAll();
    }

    public List<Feedback> getFeedbacksByBookId(String bookId) {
        return feedbackRepository.findByBookId(bookId);
    }

    public List<Feedback> getFeedbacksByUserId(String userId) {
        return feedbackRepository.findByUserId(userId);
    }

    public Feedback addFeedback(Feedback feedback) {
        return feedbackRepository.save(feedback);
    }

    public void deleteFeedback(String id) {
        feedbackRepository.deleteById(id);
    }

    // ⭐ Tính điểm trung bình (từ 1 đến 5 sao)
    public double getAverageRating(String bookId) {
        List<Feedback> feedbacks = feedbackRepository.findByBookId(bookId);
        if (feedbacks.isEmpty()) {
            return 0.0; // Không có đánh giá nào thì điểm trung bình = 0
        }

        double totalStars = feedbacks.stream()
                .mapToDouble(Feedback::getRating) // Lấy số sao của từng feedback
                .sum();

        return totalStars / feedbacks.size(); // Trung bình cộng số sao
    }
}
