package com.btec.bookmanagement_api.services;

import com.btec.bookmanagement_api.entities.Book;
import com.btec.bookmanagement_api.entities.Category;
import com.btec.bookmanagement_api.entities.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatbotService {

    private final OpenAiService openAiService;

    // ✅ 1. Gợi ý truyện bằng AI dựa theo người dùng
    public String recommendBookByAI(User user, String userInput) {
        String prompt = buildPersonalizedPrompt(user, userInput);
        return openAiService.getRecommendation(prompt);
    }

    // ✅ 2. Tóm tắt truyện
    public String summarizeBook(Book book) {
        String prompt = "Hãy tóm tắt truyện có tiêu đề \"" + book.getTitle() +
                "\" với mô tả: " + book.getDescription();
        return openAiService.getRecommendation(prompt);
    }

    // ✅ 3. Chat hỏi AI tổng quát
    public String chatWithAI(User user, String message) {
        String prompt = "Bạn là một AI hỗ trợ người đọc truyện. Người dùng hỏi: " + message;
        return openAiService.getRecommendation(prompt);
    }

    // 🔧 Hàm phụ trợ để tạo prompt cá nhân hóa
    private String buildPersonalizedPrompt(User user, String userInput) {
        StringBuilder prompt = new StringBuilder("Bạn là AI trợ lý đọc truyện.\n");

        if (user.getFavoriteCategories() != null && !user.getFavoriteCategories().isEmpty()) {
            prompt.append("Người dùng yêu thích các thể loại: ");
            prompt.append(user.getFavoriteCategories().stream()
                    .map(Category::getName)
                    .collect(Collectors.joining(", ")));
            prompt.append(".\n");
        }

        prompt.append("Người dùng muốn: ").append(userInput).append("\n");
        prompt.append("Hãy gợi ý truyện phù hợp.");
        return prompt.toString();
    }
}
