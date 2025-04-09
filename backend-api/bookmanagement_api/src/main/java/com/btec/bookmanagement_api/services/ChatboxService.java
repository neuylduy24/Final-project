package com.btec.bookmanagement_api.services;

import com.btec.bookmanagement_api.entities.Book;
import com.btec.bookmanagement_api.entities.Category;
import com.btec.bookmanagement_api.entities.Chapter;
import com.btec.bookmanagement_api.entities.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatboxService {

    private final OpenAiService openAiService;
    private final BookService bookService;
    private final FollowBookService followBookService;
    private final ChapterService chapterService;

    // ✅ 1. Gợi ý truyện bằng AI dựa theo người dùng
    public String recommendBookByAI(User user, String userInput) {
        String prompt = buildPersonalizedPrompt(userInput);
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

    private String buildPersonalizedPrompt(String userInput) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Bạn là một AI trợ lý đọc truyện, có nhiệm vụ giúp người dùng tìm truyện phù hợp.\n");
        prompt.append("Phân tích dữ liệu các truyện dưới đây và đưa ra gợi ý phù hợp nhất với nhu cầu người dùng.\n\n");
        List<Book> allBooks = bookService.getAllBooks();

        prompt.append("Dưới đây là danh sách các truyện hiện có:\n");

        for (Book book : allBooks) {
            String title = book.getTitle();
            String author = book.getAuthor();
            String description = book.getDescription();
            List<Category> categories = book.getCategories();
            int views = book.getViews();
            long followers = followBookService.countFollowersByBookId(book.getId());
            double rating = book.getAverageRating();

            // Đếm số chương theo bookId
            int chapterCount = countChaptersByBookId(book.getId());

            prompt.append("📚 Tên truyện: ").append(title).append("\n");
            if (author != null) {
                prompt.append("✍️ Tác giả: ").append(author).append("\n");
            }

            if (categories != null && !categories.isEmpty()) {
                prompt.append("🏷️ Thể loại: ");
                for (int i = 0; i < categories.size(); i++) {
                    prompt.append(categories.get(i).getName());
                    if (i < categories.size() - 1) prompt.append(", ");
                }
                prompt.append("\n");
            }

            if (description != null && !description.isBlank()) {
                prompt.append("📖 Mô tả: ").append(description).append("\n");
            }

            prompt.append("👀 Lượt xem: ").append(views).append("\n");
            prompt.append("⭐ Đánh giá trung bình: ").append(String.format("%.1f", rating)).append(" / 5.0\n");
            prompt.append("👥 Người theo dõi: ").append(followers).append("\n");
            prompt.append("📄 Số chương: ").append(chapterCount).append("\n\n");
        }

        prompt.append("Yêu cầu của người dùng: ").append(userInput).append("\n");
        prompt.append("→ Hãy gợi ý những truyện phù hợp từ danh sách trên và giải thích lý do lựa chọn.");

        return prompt.toString();
    }
    private int countChaptersByBookId(String bookId) {
        // Giả sử bạn có ChapterService
        List<Chapter> chapters = chapterService.findByBookId(bookId);
        return chapters != null ? chapters.size() : 0;
    }
    
}
