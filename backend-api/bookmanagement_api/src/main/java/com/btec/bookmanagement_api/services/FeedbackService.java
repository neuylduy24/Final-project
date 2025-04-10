package com.btec.bookmanagement_api.services;

import com.btec.bookmanagement_api.entities.Feedback;
import com.btec.bookmanagement_api.repositories.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class FeedbackService {
    @Autowired
    private FeedbackRepository feedbackRepository;

    // ✅ Lấy tất cả feedback (comment + rating)
    public List<Feedback> getFeedbacksByBookId(String bookId) {
        return feedbackRepository.findByBookId(bookId);
    }

    // ✅ Lấy danh sách comment (chỉ có nội dung, không cần rating)
    public List<Feedback> getCommentsByBookId(String bookId) {
        return feedbackRepository.findByBookIdAndContentNotNull(bookId);
    }

    // ✅ Lấy danh sách rating (chỉ có số sao)
    public List<Feedback> getRatingsByBookId(String bookId) {
        return feedbackRepository.findByBookIdAndRatingGreaterThan(bookId, 0);
    }

    // ✅ Tính điểm trung bình rating
    public double getAverageRating(String bookId) {
        List<Feedback> ratings = getRatingsByBookId(bookId);
        if (ratings.isEmpty()) {
            return 0.0; // Không có rating nào thì điểm trung bình = 0
        }

        double totalStars = ratings.stream().mapToDouble(Feedback::getRating).sum();
        return totalStars / ratings.size(); // Trung bình cộng số sao
    }

    // ✅ Thêm mới feedback (comment hoặc rating)
    public Feedback createFeedback(Feedback feedback) {
        feedback.setCreatedAt(LocalDateTime.now());
        return feedbackRepository.save(feedback);
    }

    // ✅ Cập nhật feedback (chỉ cho phép sửa nếu feedback tồn tại)
    public Optional<Feedback> updateFeedback(String id, Feedback updatedFeedback) {
        return feedbackRepository.findById(id).map(existingFeedback -> {
            existingFeedback.setContent(updatedFeedback.getContent());
            existingFeedback.setRating(updatedFeedback.getRating());
            return feedbackRepository.save(existingFeedback);
        });
    }

    // ✅ Xóa feedback
    public void deleteFeedback(String id) {
        feedbackRepository.deleteById(id);
    }
}
