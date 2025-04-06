package com.btec.bookmanagement_api.entities;

import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;
import java.util.UUID;

@Document(collection = "reading_histories")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReadingHistory {

    @Id
    private String id;

    @Indexed
    @Field(name = "email")
    private String email;  // 🔹 Email là định danh chính của người dùng

    @Field(name = "userId")
    private String userId;

    @Indexed
    @Field(name = "chapterId")
    private String chapterId;

    @Indexed
    @Field(name = "bookId")
    private String bookId;

    @Field(name = "session_id")
    private String sessionId; // 🔹 ID duy nhất cho mỗi lần đọc (giúp lưu nhiều lịch sử đọc)

    @Field(name = "progress")
    private int progress; // 🔹 Tiến trình đọc (% hoặc số trang)

    @Field(name = "time_spent")
    private long timeSpent; // 🔹 Tổng thời gian đã đọc (tính bằng giây)

    @Field(name = "start_time")
    private Instant startTime; // 🔹 Thời gian bắt đầu đọc

    @Field(name = "end_time")
    private Instant endTime; // 🔹 Thời gian kết thúc đọc (nếu chưa kết thúc thì null)

    @Field(name = "last_read_at")
    private Instant lastReadAt = Instant.now(); // 🔹 Lần cuối đọc sách này

    @Field(name = "created_at")
    private Instant createdAt = Instant.now();

    @Field(name = "updated_at")
    private Instant updatedAt;

    @ManyToOne(fetch = FetchType.LAZY) // Many ReadingHistories can reference the same Book
    @JoinColumn(name = "book_id", referencedColumnName = "id", insertable = false, updatable = false) // Foreign key relationship
    private Book book; // The actual Book object

    @ManyToOne(fetch = FetchType.LAZY) // Many ReadingHistories can reference the same Chapter
    @JoinColumn(name = "chapter_id", referencedColumnName = "id", insertable = false, updatable = false) // Foreign key relationship
    private Chapter chapter; // The chapter the user is currently reading

    // 🔹 Bắt đầu một session mới
    public static ReadingHistory startNewSession(String email, String userId, String bookId, String chapterId) {
        return ReadingHistory.builder()
                .id(UUID.randomUUID().toString()) // Tạo ID duy nhất
                .email(email)
                .userId(userId)
                .bookId(bookId)
                .sessionId(UUID.randomUUID().toString()) // Mỗi lần đọc có một session ID riêng
                .progress(0)
                .timeSpent(0)
                .startTime(Instant.now()) // Ghi nhận thời gian bắt đầu đọc
                .lastReadAt(Instant.now())
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .chapterId(chapterId)  // Set the chapter being read
                .build();
    }

    // 🔹 Cập nhật tiến trình đọc
    public void updateProgress(int newProgress, long additionalTimeSpent, String chapterId) {
        this.progress = Math.max(this.progress, newProgress); // Lấy giá trị cao nhất
        this.timeSpent += additionalTimeSpent;
        this.lastReadAt = Instant.now();
        this.updatedAt = Instant.now();
        this.chapterId = chapterId;  // Update the chapter if it changes
    }

    // 🔹 Kết thúc session đọc
    public void endReadingSession() {
        this.endTime = Instant.now();
        this.updatedAt = Instant.now();
    }
}
