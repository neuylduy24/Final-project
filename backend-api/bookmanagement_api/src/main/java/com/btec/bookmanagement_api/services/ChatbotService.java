package com.btec.bookmanagement_api.services;

import com.btec.bookmanagement_api.entities.Book;
import com.btec.bookmanagement_api.entities.Category;
import com.btec.bookmanagement_api.entities.Chapter;
import com.btec.bookmanagement_api.entities.User;
import com.btec.bookmanagement_api.entities.Feedback;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatbotService {

    private final GeminiService geminiService; // Change to GeminiService
    private final BookService bookService;
    private final FollowBookService followBookService;
    private final ChapterService chapterService;
    private final CategoryService categoryService;
    private final ReadingHistoryService readingHistoryService;
    private final FeedbackService feedbackService;

    // ✅ 1. Gợi ý truyện bằng AI dựa theo người dùng
    public String recommendBookByAI(User user, String userInput) {
        String prompt = buildStructuredRecommendationPrompt(userInput);
        return geminiService.getRecommendation(prompt); // Use geminiService
    }

    // ✅ 2. Tóm tắt truyện
    public String summarizeBook(Book book) {
        String prompt = "Hãy tóm tắt truyện có tiêu đề \"" + book.getTitle() +
                "\" với mô tả: " + book.getDescription();
        return geminiService.getRecommendation(prompt); // Use geminiService
    }

    // ✅ 3. Chat hỏi AI tổng quát
    public String chatWithAI(User user, String message) {
        String prompt = "Bạn là một AI hỗ trợ người đọc truyện. Người dùng hỏi: " + message;
        return geminiService.getRecommendation(prompt); // Use geminiService
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

    public String answerProjectDataQuestion(String question) {
        // Get data relevant to the specific question
        Map<String, Object> relevantData = fetchRelevantData(question);
        StringBuilder contextBuilder = new StringBuilder();
        
        // Base statistics - always include
        List<Book> allBooks = bookService.getAllBooks();
        List<Category> categories = categoryService.getAllCategories();
        
        contextBuilder.append("Thông tin cơ sở dữ liệu: ")
                     .append(allBooks.size())
                     .append(" tổng số sách, ")
                     .append(categories.size())
                     .append(" thể loại: ")
                     .append(categories.stream()
                             .map(Category::getName)
                             .collect(Collectors.joining(", ")))
                     .append(".\n\n");
        
        // Book search results (when searching by title/keyword)
        if (relevantData.containsKey("searchResults")) {
            @SuppressWarnings("unchecked")
            List<Book> bookResults = (List<Book>) relevantData.get("searchResults");
            if (!bookResults.isEmpty()) {
                contextBuilder.append("Kết quả tìm kiếm sách:\n");
                bookResults.stream().limit(5).forEach(book -> {
                    contextBuilder.append("- Tiêu đề: \"").append(book.getTitle()).append("\"\n");
                    contextBuilder.append("  Tác giả: ").append(book.getAuthor() != null ? book.getAuthor() : "Không rõ").append("\n");
                    
                    if (book.getCategories() != null && !book.getCategories().isEmpty()) {
                        contextBuilder.append("  Thể loại: ").append(
                            book.getCategories().stream()
                                .map(Category::getName)
                                .collect(Collectors.joining(", "))
                        ).append("\n");
                    }
                    
                    contextBuilder.append("  Số chương: ").append(countChaptersByBookId(book.getId())).append("\n");
                    contextBuilder.append("  Lượt xem: ").append(book.getViews()).append("\n\n");
                });
                
                if (bookResults.size() > 5) {
                    contextBuilder.append("... và ").append(bookResults.size() - 5).append(" sách khác\n\n");
                }
            }
        }
        
        // Category-specific books
        if (relevantData.containsKey("categoryBooks")) {
            @SuppressWarnings("unchecked")
            Map<String, List<Book>> booksByCategory = (Map<String, List<Book>>) relevantData.get("categoryBooks");
            
            if (!booksByCategory.isEmpty()) {
                contextBuilder.append("Sách theo thể loại:\n");
                booksByCategory.forEach((categoryName, books) -> {
                    contextBuilder.append("Thể loại \"").append(categoryName).append("\" (")
                                .append(books.size()).append(" sách):\n");
                    
                    books.stream().limit(5).forEach(book -> 
                        contextBuilder.append("- \"").append(book.getTitle())
                                    .append("\" (").append(book.getViews()).append(" lượt xem)\n")
                    );
                    
                    if (books.size() > 5) {
                        contextBuilder.append("  ... và ").append(books.size() - 5).append(" sách khác\n");
                    }
                    contextBuilder.append("\n");
                });
            }
        }
        
        // Chapter information
        if (relevantData.containsKey("chapters")) {
            @SuppressWarnings("unchecked")
            Map<String, List<Chapter>> chapterData = (Map<String, List<Chapter>>) relevantData.get("chapters");
            
            if (!chapterData.isEmpty()) {
                contextBuilder.append("Thông tin chương sách:\n");
                chapterData.forEach((bookTitle, chapters) -> {
                    contextBuilder.append("Sách \"").append(bookTitle).append("\" có ")
                                .append(chapters.size()).append(" chương:\n");
                    
                    chapters.stream().limit(8).forEach(chapter -> 
                        contextBuilder.append("- Chương ").append(chapter.getChapterNumber())
                                    .append(": \"").append(chapter.getTitle()).append("\"\n")
                    );
                    
                    if (chapters.size() > 8) {
                        contextBuilder.append("  ... và ").append(chapters.size() - 8).append(" chương khác\n");
                    }
                    contextBuilder.append("\n");
                });
            }
        }
        
        // Popular books
        if (relevantData.containsKey("popularBooks")) {
            @SuppressWarnings("unchecked")
            List<Book> popularBooks = (List<Book>) relevantData.get("popularBooks");
            
            if (!popularBooks.isEmpty()) {
                contextBuilder.append("Sách phổ biến nhất (theo lượt xem):\n");
                for (int i = 0; i < Math.min(popularBooks.size(), 10); i++) {
                    Book book = popularBooks.get(i);
                    contextBuilder.append(i+1).append(". \"").append(book.getTitle())
                                .append("\" (").append(book.getViews()).append(" lượt xem");
                    
                    if (book.getCategories() != null && !book.getCategories().isEmpty()) {
                        contextBuilder.append(", Thể loại: ").append(
                            book.getCategories().stream()
                                .map(Category::getName)
                                .collect(Collectors.joining(", "))
                        );
                    }
                    
                    contextBuilder.append(")\n");
                }
                contextBuilder.append("\n");
            }
        }
        
        // Recommended books
        if (relevantData.containsKey("recommendedBooks")) {
            @SuppressWarnings("unchecked")
            List<Book> recommendedBooks = (List<Book>) relevantData.get("recommendedBooks");
            
            if (!recommendedBooks.isEmpty()) {
                contextBuilder.append("Đề xuất sách phù hợp với yêu cầu:\n");
                for (int i = 0; i < Math.min(recommendedBooks.size(), 5); i++) {
                    Book book = recommendedBooks.get(i);
                    contextBuilder.append(i+1).append(". \"").append(book.getTitle()).append("\"\n");
                    
                    if (book.getCategories() != null && !book.getCategories().isEmpty()) {
                        contextBuilder.append("   Thể loại: ").append(
                            book.getCategories().stream()
                                .map(Category::getName)
                                .collect(Collectors.joining(", "))
                        ).append("\n");
                    }
                    
                    if (book.getDescription() != null && !book.getDescription().isEmpty()) {
                        String desc = book.getDescription().length() > 100 ? 
                            book.getDescription().substring(0, 100) + "..." : 
                            book.getDescription();
                        contextBuilder.append("   Mô tả: ").append(desc).append("\n");
                    }
                    
                    contextBuilder.append("   Số chương: ").append(countChaptersByBookId(book.getId())).append("\n\n");
                }
            }
        }
        
        // Final prompt for AI
        String prompt = "Bạn là trợ lý AI cho hệ thống sách. Dựa vào dữ liệu sau, hãy trả lời câu hỏi:\n\n" +
                        contextBuilder.toString() + 
                        "\nCâu hỏi: \"" + question + "\"\n\n" +
                        "Trả lời rõ ràng, đầy đủ và thân thiện. Nếu bạn gợi ý sách, giải thích lý do đề xuất.";
        
        return geminiService.getRecommendation(prompt);
    }

    private Map<String, Object> fetchRelevantData(String question) {
        Map<String, Object> data = new HashMap<>();
        String lowercaseQuestion = question.toLowerCase();
        
        // BOOK SEARCH QUERIES
        if (containsAny(lowercaseQuestion, "tìm sách", "tìm truyện", "sách tên", "truyện tên", "có sách", "search book")) {
            String searchTerm = extractSearchTerm(question);
            if (!searchTerm.isEmpty()) {
                List<Book> results = bookService.searchBooksByTitle(searchTerm);
                if (!results.isEmpty()) {
                    data.put("searchResults", results);
                }
            }
        }
        
        // CATEGORY QUERIES
        if (containsAny(lowercaseQuestion, "thể loại", "phân loại", "category", "genre", "loại sách")) {
            Map<String, List<Book>> booksByCategory = new HashMap<>();
            boolean specificCategoryFound = false;
            
            // Check for specific category mention
            for (Category category : categoryService.getAllCategories()) {
                if (lowercaseQuestion.contains(category.getName().toLowerCase())) {
                    List<Book> categoryBooks = getBooksByCategory(category.getId());
                    if (!categoryBooks.isEmpty()) {
                        booksByCategory.put(category.getName(), categoryBooks);
                        specificCategoryFound = true;
                    }
                }
            }
            
            // If no specific category found but asking about categories
            if (!specificCategoryFound && containsAny(lowercaseQuestion, "danh sách", "list", "tất cả", "all")) {
                for (Category category : categoryService.getAllCategories()) {
                    List<Book> categoryBooks = getBooksByCategory(category.getId());
                    if (!categoryBooks.isEmpty()) {
                        booksByCategory.put(category.getName(), categoryBooks);
                    }
                }
            }
            
            if (!booksByCategory.isEmpty()) {
                data.put("categoryBooks", booksByCategory);
            }
        }
        
        // CHAPTER QUERIES
        if (containsAny(lowercaseQuestion, "chương", "chapter", "tập", "phần")) {
            Map<String, List<Chapter>> bookChapters = new HashMap<>();
            boolean specificBookFound = false;
            
            // First check for a specific book mentioned
            for (Book book : bookService.getAllBooks()) {
                if (lowercaseQuestion.contains(book.getTitle().toLowerCase())) {
                    List<Chapter> chapters = chapterService.findByBookId(book.getId());
                    if (!chapters.isEmpty()) {
                        bookChapters.put(book.getTitle(), chapters);
                        specificBookFound = true;
                        break;
                    }
                }
            }
            
            // If asking about chapters but no specific book mentioned
            if (!specificBookFound) {
                List<Book> popularBooks = bookService.getBooksByViews();
                int booksToShow = Math.min(3, popularBooks.size());
                
                for (int i = 0; i < booksToShow; i++) {
                    Book book = popularBooks.get(i);
                    List<Chapter> chapters = chapterService.findByBookId(book.getId());
                    if (!chapters.isEmpty()) {
                        bookChapters.put(book.getTitle(), chapters);
                    }
                }
            }
            
            if (!bookChapters.isEmpty()) {
                data.put("chapters", bookChapters);
            }
        }
        
        // POPULAR BOOKS QUERIES
        if (containsAny(lowercaseQuestion, "phổ biến", "nổi bật", "xem nhiều", "popular", "trending", "hot")) {
            data.put("popularBooks", bookService.getBooksByViews());
        }
        
        // RECOMMENDATION QUERIES
        if (containsAny(lowercaseQuestion, "gợi ý", "đề xuất", "recommend", "suggest", "nên đọc", "hay nhất")) {
            List<Book> recommendedBooks = new ArrayList<>();
            boolean hasGenreCriteria = false;
            
            // Check for genre preferences
            for (Category category : categoryService.getAllCategories()) {
                if (lowercaseQuestion.contains(category.getName().toLowerCase())) {
                    recommendedBooks.addAll(getBooksByCategory(category.getId()));
                    hasGenreCriteria = true;
                }
            }
            
            // If no specific genre mentioned, recommend popular books
            if (!hasGenreCriteria) {
                recommendedBooks.addAll(bookService.getBooksByViews());
            }
            
            // Sort by view count
            if (!recommendedBooks.isEmpty()) {
                recommendedBooks.sort((b1, b2) -> b2.getViews() - b1.getViews());
                data.put("recommendedBooks", recommendedBooks.stream().distinct().collect(Collectors.toList()));
            }
        }
        
        return data;
    }

    // Get books by category ID - helper method
    private List<Book> getBooksByCategory(String categoryId) {
        // Get all books then filter by category
        List<Book> allBooks = bookService.getAllBooks();
        return allBooks.stream()
                .filter(book -> book.getCategories() != null && 
                        book.getCategories().stream()
                            .anyMatch(cat -> cat.getId().equals(categoryId)))
                .collect(Collectors.toList());
    }

    // Helper method to check if text contains any of the given phrases
    private boolean containsAny(String text, String... phrases) {
        for (String phrase : phrases) {
            if (text.contains(phrase)) {
                return true;
            }
        }
        return false;
    }

    // Helper method to extract the search term from a question
    private String extractSearchTerm(String question) {
        // Common patterns that might precede the search term
        String[] patterns = {
            "tìm sách", "tìm truyện", "sách tên", "truyện tên",
            "sách có tên", "truyện có tên", "tên sách", "tên truyện"
        };
        
        // Try to identify pattern and extract text after it
        for (String pattern : patterns) {
            if (question.toLowerCase().contains(pattern.toLowerCase())) {
                int patternIndex = question.toLowerCase().indexOf(pattern.toLowerCase());
                String remainder = question.substring(patternIndex + pattern.length()).trim();
                
                // Remove connecting words
                remainder = remainder.replaceFirst("^(là|như|về|có tên là|có tên|tên là)\\s+", "");
                
                // If we have quotation marks, extract content between them
                if (remainder.contains("\"")) {
                    int startQuote = remainder.indexOf("\"");
                    int endQuote = remainder.indexOf("\"", startQuote + 1);
                    if (endQuote > startQuote) {
                        return remainder.substring(startQuote + 1, endQuote).trim();
                    }
                }
                
                // Otherwise take first few words
                String[] words = remainder.split("\\s+");
                StringBuilder term = new StringBuilder();
                for (int i = 0; i < Math.min(5, words.length); i++) {
                    if (words[i].matches(".*[?!.,;:]$")) {
                        term.append(words[i].replaceAll("[?!.,;:]$", "")).append(" ");
                        break;
                    }
                    term.append(words[i]).append(" ");
                }
                
                return term.toString().trim();
            }
        }
        
        return "";
    }
}
