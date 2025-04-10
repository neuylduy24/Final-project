package com.btec.bookmanagement_api.repositories;

import com.btec.bookmanagement_api.entities.Feedback;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;


public interface FeedbackRepository extends MongoRepository<Feedback, String> {
    List<Feedback> findByBookId(String bookId);
    List<Feedback> findByBookIdAndContentNotNull(String bookId); // Lấy comment có nội dung
    List<Feedback> findByBookIdAndRatingGreaterThan(String bookId, int minRating); // Lấy rating có sao
}
