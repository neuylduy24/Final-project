package com.btec.bookmanagement_api.controllers;

import com.btec.bookmanagement_api.entities.Book;
import com.btec.bookmanagement_api.entities.User;
import com.btec.bookmanagement_api.services.RecommendationService;
import com.btec.bookmanagement_api.services.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final BookService bookService;
    private final RecommendationService recommendationService;

    @GetMapping("/for-you")
    public List<Book> getForYou(@AuthenticationPrincipal User user) {
        if (user != null) {
            // Nếu người dùng đã đăng nhập, trả về đề xuất cá nhân hóa
            return recommendationService.recommendBooks(user.getEmail());
        } else {
            // Nếu người dùng chưa đăng nhập, trả về top 8 truyện có lượt xem cao nhất
            return bookService.getBooksByViews();
        }
    }
}

