package com.btec.bookmanagement_api.controllers;

import com.btec.bookmanagement_api.entities.Book;
import com.btec.bookmanagement_api.entities.User;
import com.btec.bookmanagement_api.repositories.BookRepository;
import com.btec.bookmanagement_api.services.ChatboxService;
import com.btec.bookmanagement_api.services.UserService;
import com.btec.bookmanagement_api.security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
public class ChatbotController {

    private final ChatboxService chatboxService;
    private final UserService userService;
    private final BookRepository bookRepository;

    // ✅ API: Chat hỏi AI tổng quát (KHÔNG cần đăng nhập)
    @PostMapping("/ask")
    public ResponseEntity<String> chatWithAI(@RequestBody Map<String, String> request) {
        String message = request.get("message");

        // Gửi null vì không có user → AI trả lời không cá nhân hóa
        String reply = chatboxService.chatWithAI(null, message);
        return ResponseEntity.ok(reply);
    }

    // ✅ API: Gợi ý truyện theo AI (KHÔNG cần đăng nhập)
    @PostMapping("/recommend")
    public ResponseEntity<String> recommendBookByAI(@RequestBody Map<String, String> request) {
        String input = request.get("message");

        // Gửi null vì không có user → AI gợi ý ngẫu nhiên / theo trend
        String suggestion = chatboxService.recommendBookByAI(null, input);
        return ResponseEntity.ok(suggestion);
    }

    // ✅ API: Tóm tắt truyện (truyền vào tên truyện, không cần token)
    @GetMapping("/summarize")
    public ResponseEntity<String> summarizeBook(@RequestParam String title) {
        List<Book> matchedBooks = bookRepository.findByTitleContainingIgnoreCase(title);

        if (matchedBooks.isEmpty()) {
            return ResponseEntity.badRequest().body("Không tìm thấy truyện có tiêu đề chứa: " + title);
        }

        Book selectedBook = matchedBooks.get(0);
        String summary = chatboxService.summarizeBook(selectedBook);
        return ResponseEntity.ok(summary);
    }
}
