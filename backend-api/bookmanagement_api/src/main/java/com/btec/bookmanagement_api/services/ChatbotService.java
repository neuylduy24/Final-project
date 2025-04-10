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
        try {
            Map<String, Object> relevantData = fetchRelevantData(question);
            // Debug output of what data was found
            System.out.println("Data keys found for query: " + String.join(", ", relevantData.keySet()));
            
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
            
            // Specific book details - Add this section
            if (relevantData.containsKey("specificBook")) {
                Book book = (Book) relevantData.get("specificBook");
                contextBuilder.append("Chi tiết về sách \"").append(book.getTitle()).append("\":\n");
                
                // Author
                contextBuilder.append("- Tác giả: ").append(book.getAuthor() != null ? book.getAuthor() : "Không rõ").append("\n");
                
                // Categories
                if (book.getCategories() != null && !book.getCategories().isEmpty()) {
                    contextBuilder.append("- Thể loại: ").append(
                        book.getCategories().stream()
                            .map(Category::getName)
                            .collect(Collectors.joining(", "))
                    ).append("\n");
                }
                
                // Description
                if (book.getDescription() != null && !book.getDescription().trim().isEmpty()) {
                    contextBuilder.append("- Mô tả: ").append(book.getDescription()).append("\n");
                }
                
                // Views
                contextBuilder.append("- Lượt xem: ").append(book.getViews()).append("\n");
                
                // Chapter count
                int chapterCount = countChaptersByBookId(book.getId());
                contextBuilder.append("- Số chương: ").append(chapterCount).append("\n");
                
                // Chapter information if available
                if (relevantData.containsKey("specificBookChapters")) {
                    @SuppressWarnings("unchecked")
                    List<Chapter> chapters = (List<Chapter>) relevantData.get("specificBookChapters");
                    contextBuilder.append("\nDanh sách chương (").append(Math.min(5, chapters.size())).append(" chương đầu):\n");
                    
                    chapters.stream().limit(5).forEach(chapter -> 
                        contextBuilder.append("  + Chương ").append(chapter.getChapterNumber())
                                    .append(": ").append(chapter.getTitle()).append("\n")
                    );
                    
                    if (chapters.size() > 5) {
                        contextBuilder.append("  + ... và ").append(chapters.size() - 5).append(" chương khác\n");
                    }
                }
                
                // Feedback information if available
                if (relevantData.containsKey("specificBookFeedbacks")) {
                    @SuppressWarnings("unchecked")
                    List<Feedback> feedbacks = (List<Feedback>) relevantData.get("specificBookFeedbacks");
                    
                    // Calculate average rating
                    double avgRating = feedbacks.stream()
                        .mapToDouble(Feedback::getRating)
                        .average()
                        .orElse(0);
                    
                    contextBuilder.append("\n- Đánh giá trung bình: ").append(String.format("%.1f", avgRating))
                                 .append(" sao (từ ").append(feedbacks.size()).append(" đánh giá)\n");
                    
                    // Sample a few reviews
                    if (!feedbacks.isEmpty()) {
                        contextBuilder.append("\nMột số nhận xét từ độc giả:\n");
                        feedbacks.stream()
                            .filter(f -> f.getContent() != null && !f.getContent().trim().isEmpty())
                            .limit(3)
                            .forEach(f -> contextBuilder.append("  \"").append(f.getContent()).append("\"\n"));
                    }
                }
                
                contextBuilder.append("\n");
            }
            
            // Final prompt for AI
            String prompt = "Bạn là trợ lý AI cho hệ thống sách. Dựa vào dữ liệu sau, hãy trả lời câu hỏi:\n\n" +
                            contextBuilder.toString() + 
                            "\nCâu hỏi: \"" + question + "\"\n\n" +
                            "Trả lời rõ ràng, đầy đủ và thân thiện. Nếu bạn gợi ý sách, giải thích lý do đề xuất.";
            
            return geminiService.getRecommendation(prompt);
        } catch (Exception e) {
            System.err.println("Error processing question: " + e.getMessage());
            e.printStackTrace();
            return "Xin lỗi, tôi gặp lỗi khi xử lý câu hỏi của bạn. Chi tiết lỗi: " + e.getMessage();
        }
    }

    private Map<String, Object> fetchRelevantData(String question) {
        Map<String, Object> data = new HashMap<>();
        String lowercaseQuestion = question.toLowerCase();
        
        // SPECIFIC BOOK QUERY - New section to handle detailed book inquiries
        if (containsAny(lowercaseQuestion, "nói về", "kể về", "giới thiệu", "chi tiết", "thông tin", "nội dung", "cốt truyện")) {
            // Try to identify a specific book in the question
            Book specificBook = findSpecificBookInQuestion(question);
            if (specificBook != null) {
                // Add book details to the data map
                data.put("specificBook", specificBook);
                
                // Add chapter information for this specific book
                List<Chapter> chapters = chapterService.findByBookId(specificBook.getId());
                if (chapters != null && !chapters.isEmpty()) {
                    data.put("specificBookChapters", chapters);
                }
                
                // Get feedback data for this book if available
                List<Feedback> feedbacks = feedbackService.getFeedbacksByBookId(specificBook.getId());
                if (feedbacks != null && !feedbacks.isEmpty()) {
                    data.put("specificBookFeedbacks", feedbacks);
                }
            }
        }
        
        // Enhanced book search detection with more patterns
        if (containsAny(lowercaseQuestion, "tìm sách", "tìm truyện", "sách tên", "truyện tên", 
                "có sách", "search book", "sách nào", "truyện nào", "cuốn sách", "cuốn truyện", 
                "thông tin về sách", "thông tin về truyện", "tìm thông tin", "truy", "tìm hiểu về", 
                "muốn đọc", "muốn biết về")) {
            
            // First check if there's a direct book match
            Book specificBook = findSpecificBookInQuestion(question);
            if (specificBook != null) {
                data.put("specificBook", specificBook);
                
                // Add chapter and feedback data
                List<Chapter> chapters = chapterService.findByBookId(specificBook.getId());
                if (chapters != null && !chapters.isEmpty()) {
                    data.put("specificBookChapters", chapters);
                }
                
                List<Feedback> feedbacks = feedbackService.getFeedbacksByBookId(specificBook.getId());
                if (feedbacks != null && !feedbacks.isEmpty()) {
                    data.put("specificBookFeedbacks", feedbacks);
                }
            } else {
                // Try standard search
                String searchTerm = extractSearchTerm(question);
                if (!searchTerm.isEmpty()) {
                    List<Book> results = bookService.searchBooksByTitle(searchTerm);
                    if (!results.isEmpty()) {
                        data.put("searchResults", results);
                    } else {
                        // If no results, use the full question as search
                        results = bookService.searchBooksByTitle(question);
                        if (!results.isEmpty()) {
                            data.put("searchResults", results);
                        }
                    }
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
            
            // Check for genre preferences - More defensive with null checks
            for (Category category : categoryService.getAllCategories()) {
                if (category.getName() != null && 
                    lowercaseQuestion.contains(category.getName().toLowerCase())) {
                    try {
                        List<Book> categoryBooks = getBooksByCategory(category.getId());
                        if (categoryBooks != null && !categoryBooks.isEmpty()) {
                            recommendedBooks.addAll(categoryBooks);
                            hasGenreCriteria = true;
                        }
                    } catch (Exception e) {
                        // Log error but continue processing
                        System.err.println("Error getting books for category: " + category.getName() + ": " + e.getMessage());
                    }
                }
            }
            
            // If no specific genre mentioned, recommend popular books
            if (!hasGenreCriteria) {
                try {
                    List<Book> popularBooks = bookService.getBooksByViews();
                    if (popularBooks != null) {
                        recommendedBooks.addAll(popularBooks);
                    }
                } catch (Exception e) {
                    System.err.println("Error getting popular books: " + e.getMessage());
                }
            }
            
            // Sort by view count - with null safety
            if (!recommendedBooks.isEmpty()) {
                try {
                    recommendedBooks.sort((b1, b2) -> {
                            int views1 = b1 != null ? b1.getViews() : 0;
                            int views2 = b2 != null ? b2.getViews() : 0;
                            return views2 - views1;
                        });
                    data.put("recommendedBooks", recommendedBooks.stream()
                        .distinct()
                        .collect(Collectors.toList()));
                } catch (Exception e) {
                    System.err.println("Error sorting recommended books: " + e.getMessage());
                    // Still add unsorted books rather than failing
                    data.put("recommendedBooks", recommendedBooks.stream()
                        .distinct()
                        .collect(Collectors.toList()));
                }
            }
        }
        
        return data;
    }

    // Improved book finding method with fuzzy matching and partial title support
    private Book findSpecificBookInQuestion(String question) {
        List<Book> allBooks = bookService.getAllBooks();
        String lowercaseQuestion = question.toLowerCase();
        
        // First attempt: direct title matching (most precise)
        for (Book book : allBooks) {
            if (book.getTitle() != null && lowercaseQuestion.contains(book.getTitle().toLowerCase())) {
                System.out.println("Found exact match for book: " + book.getTitle());
                return book;
            }
        }
        
        // Second attempt: Check for quoted book titles
        if (question.contains("\"")) {
            int start = question.indexOf("\"");
            int end = question.indexOf("\"", start + 1);
            if (end > start) {
                String quotedTitle = question.substring(start + 1, end).trim().toLowerCase();
                for (Book book : allBooks) {
                    if (book.getTitle() != null && book.getTitle().toLowerCase().contains(quotedTitle)) {
                        System.out.println("Found quoted match for book: " + book.getTitle());
                        return book;
                    }
                }
            }
        }
        
        // Third attempt: Partial matching (for each word in title)
        for (Book book : allBooks) {
            if (book.getTitle() != null) {
                String[] titleWords = book.getTitle().toLowerCase().split("\\s+");
                // If title has multiple words and is 4+ chars, check for matches
                if (titleWords.length > 1) {
                    for (String word : titleWords) {
                        if (word.length() >= 4 && lowercaseQuestion.contains(word)) {
                            System.out.println("Found partial match for book: " + book.getTitle() + " (matched word: " + word + ")");
                            return book;
                        }
                    }
                }
            }
        }
        
        // Last attempt: Use book service search directly
        List<Book> searchResults = bookService.searchBooksByTitle(question);
        if (!searchResults.isEmpty()) {
            System.out.println("Found match via search service: " + searchResults.get(0).getTitle());
            return searchResults.get(0);
        }
        
        System.out.println("No book match found for query: " + question);
        return null;
    }

    // Get books by category ID - helper method with better error handling
    private List<Book> getBooksByCategory(String categoryId) {
        if (categoryId == null || categoryId.isEmpty()) {
            return new ArrayList<>();
        }
        
        // Get all books then filter by category - with defensive programming
        List<Book> allBooks = bookService.getAllBooks();
        return allBooks.stream()
                .filter(book -> book != null && 
                       book.getCategories() != null && 
                       !book.getCategories().isEmpty() && 
                       book.getCategories().stream()
                           .filter(cat -> cat != null && cat.getId() != null)
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
