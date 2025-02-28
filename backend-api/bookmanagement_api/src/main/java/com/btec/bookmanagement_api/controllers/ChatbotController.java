package com.btec.bookmanagement_api.controllers;

import com.btec.bookmanagement_api.entities.Book;
import com.btec.bookmanagement_api.repositories.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/chatbot")
public class ChatbotController {

    @Autowired
    private BookRepository bookRepository;

    private final String OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
    private final String API_KEY = "YOUR_OPENAI_API_KEY"; // Thay bằng API Key thật

    // ✅ 1. Hỏi chatbot về nội dung sách
    @PostMapping("/ask")
    public String askChatbot(@RequestBody String question) {
        String prompt = "Bạn là một chuyên gia sách. Hãy giúp tôi trả lời: " + question;

        RestTemplate restTemplate = new RestTemplate();
        String response = restTemplate.postForObject(OPENAI_API_URL, new ChatRequest(prompt, API_KEY), String.class);
        return response;
    }

    // ✅ 2. Tìm sách phù hợp theo mô tả chatbot
    @GetMapping("/find-book")
    public Optional<Book> findBookByDescription(@RequestParam String description) {
        List<Book> books = bookRepository.findAll();
        return books.stream()
                .filter(book -> book.getDescription().toLowerCase().contains(description.toLowerCase()))
                .findFirst();
    }

    // ✅ 3. Gửi prompt cho AI để tìm sách phù hợp
    @PostMapping("/recommend-book")
    public Optional<Book> recommendBook(@RequestBody String userInput) {
        String prompt = "Hãy đề xuất sách phù hợp với nội dung sau: " + userInput;

        RestTemplate restTemplate = new RestTemplate();
        String aiResponse = restTemplate.postForObject(OPENAI_API_URL, new ChatRequest(prompt, API_KEY), String.class);

        return findBookByDescription(aiResponse);
    }

    // DTO để gửi request đến OpenAI API
    private static class ChatRequest {
        public String model = "gpt-4";
        public List<Message> messages;
        public String apiKey;

        public ChatRequest(String content, String apiKey) {
            this.apiKey = apiKey;
            this.messages = List.of(new Message("user", content));
        }
    }

    private static class Message {
        public String role;
        public String content;

        public Message(String role, String content) {
            this.role = role;
            this.content = content;
        }
    }

    @GetMapping("/search-book")
    public List<Book> searchBook(@RequestParam String query) {
        return bookRepository.searchBooks(query);
    }
}
