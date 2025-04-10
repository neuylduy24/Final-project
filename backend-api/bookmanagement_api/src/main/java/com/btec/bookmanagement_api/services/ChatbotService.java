package com.btec.bookmanagement_api.services;

import com.btec.bookmanagement_api.entities.Book;
import com.btec.bookmanagement_api.entities.Category;
import com.btec.bookmanagement_api.entities.Chapter;
import com.btec.bookmanagement_api.entities.User;
import com.btec.bookmanagement_api.entities.Feedback;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatbotService {

    private final OpenAiService openAiService;
    private final BookService bookService;
    private final FollowBookService followBookService;
    private final ChapterService chapterService;
    private final CategoryService categoryService; // Add this
    private final ReadingHistoryService readingHistoryService; // Add this
    private final FeedbackService feedbackService; // Add this

    // ✅ 1. Gợi ý truyện bằng AI dựa theo người dùng
    public String recommendBookByAI(User user, String userInput) {
        String prompt = buildStructuredRecommendationPrompt(userInput);
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

    // 🔧 Hàm phụ trợ để tạo prompt cá nhân hóa từ danh sách truyện

    private String buildStructuredRecommendationPrompt(String userInput) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Bạn là một AI gợi ý truyện cho người dùng dựa trên sở thích.\n");
        prompt.append("Phân tích danh sách truyện sau và gợi ý từ 1 đến 3 truyện phù hợp với yêu cầu của người dùng.\n");
        prompt.append("Quan trọng: Trả về dưới dạng mảng JSON với các thuộc tính: id, title, description, categories (mảng).\n");
        prompt.append("Không cần giải thích, chỉ trả về JSON duy nhất.\n\n");

        List<Book> allBooks = bookService.getAllBooks();
        prompt.append("📚 Danh sách truyện:\n");

        for (Book book : allBooks) {
            prompt.append("{\n");
            prompt.append("  \"id\": \"").append(book.getId()).append("\",\n");
            prompt.append("  \"title\": \"").append(book.getTitle()).append("\",\n");
            prompt.append("  \"description\": \"").append(book.getDescription() != null ? book.getDescription().replace("\"", "'") : "").append("\",\n");
            prompt.append("  \"categories\": [");

            List<Category> categories = book.getCategories();
            if (categories != null && !categories.isEmpty()) {
                String cats = categories.stream()
                        .map(cat -> "\"" + cat.getName() + "\"")
                        .collect(Collectors.joining(", "));
                prompt.append(cats);
            }

            prompt.append("]\n},\n");
        }

        prompt.append("\n🎯 Yêu cầu người dùng: ").append(userInput).append("\n");
        prompt.append("→ Trả kết quả là JSON duy nhất, không có giải thích, không text ngoài lề.\n");

        return prompt.toString();
    }

    private int countChaptersByBookId(String bookId) {
        // Giả sử bạn có ChapterService
        List<Chapter> chapters = chapterService.findByBookId(bookId);
        return chapters != null ? chapters.size() : 0;
    }

    // Add a new method for answering data-specific questions
    public String answerProjectDataQuestion(String question) {
        // Step 1: Gather relevant data based on the question
        StringBuilder contextBuilder = new StringBuilder();
        
        // Add book statistics
        List<Book> allBooks = bookService.getAllBooks();
        contextBuilder.append("Book statistics: ")
                     .append(allBooks.size())
                     .append(" total books.\n");
        
        // Add category statistics 
        List<Category> categories = categoryService.getAllCategories();
        contextBuilder.append("Categories: ")
                     .append(categories.stream()
                             .map(Category::getName)
                             .collect(Collectors.joining(", ")))
                     .append(".\n");
        
        // Add most popular books
        List<Book> popularBooks = bookService.getBooksByViews();
        if (!popularBooks.isEmpty()) {
            contextBuilder.append("Popular books: ");
            popularBooks.stream().limit(5).forEach(book -> 
                contextBuilder.append(book.getTitle())
                            .append(" (views: ")
                            .append(book.getViews())
                            .append("), "));
            contextBuilder.append("\n");
        }
        
        // Build the final prompt with context and question
        String prompt = "You are an assistant for a book management system with the following data:\n\n" +
                        contextBuilder.toString() + 
                        "\n\nUser question: " + question + 
                        "\n\nAnswer based on the provided data:";
        
        return openAiService.getRecommendation(prompt);
    }

    private Map<String, Object> fetchRelevantData(String question) {
        Map<String, Object> data = new HashMap<>();
        question = question.toLowerCase();
        
        // Check what the question is about and fetch relevant data
        if (question.contains("popular") || question.contains("trending") || question.contains("most read")) {
            data.put("popularBooks", bookService.getBooksByViews());
            data.put("mostFollowedBooks", bookService.getBooksSortedByFollowCount());
        }
        
        if (question.contains("categor")) {
            data.put("categories", categoryService.getAllCategories());
        }
        
        if (question.contains("feedback") || question.contains("rating") || question.contains("comment")) {
            // Sample feedback from popular books for context
            List<Book> books = bookService.getTop10BooksByViews();
            Map<String, List<Feedback>> bookFeedbacks = new HashMap<>();
            
            for (Book book : books) {
                bookFeedbacks.put(book.getTitle(), 
                                   feedbackService.getFeedbacksByBookId(book.getId()));
            }
            data.put("feedbacks", bookFeedbacks);
        }
        
        // Add more patterns as needed
        
        return data;
    }

}
