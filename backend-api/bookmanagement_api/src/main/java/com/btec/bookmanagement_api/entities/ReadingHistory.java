package com.btec.bookmanagement_api.entities;

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
    private String email;

    @Field(name = "userId")
    private String userId;

    @Indexed
    @Field(name = "chapterId")
    private String chapterId;

    @Indexed
    @Field(name = "bookId")
    private String bookId;
    private Book book;


    @Field(name = "session_id")
    private String sessionId;

    @Field(name = "progress")
    private int progress;

    @Field(name = "time_spent")
    private long timeSpent;

    @Field(name = "start_time")
    private Instant startTime;

    @Field(name = "end_time")
    private Instant endTime;

    @Field(name = "last_read_at")
    private Instant lastReadAt = Instant.now();

    @Field(name = "created_at")
    private Instant createdAt = Instant.now();

    @Field(name = "updated_at")
    private Instant updatedAt;

    public static ReadingHistory startNewSession(String email, String userId, String bookId, String chapterId) {
        return ReadingHistory.builder()
                .id(UUID.randomUUID().toString())
                .email(email)
                .userId(userId)
                .bookId(bookId)
                .chapterId(chapterId)
                .sessionId(UUID.randomUUID().toString())
                .progress(0)
                .timeSpent(0)
                .startTime(Instant.now())
                .lastReadAt(Instant.now())
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
    }

    public void updateProgress(int newProgress, long additionalTimeSpent, String chapterId) {
        this.progress = Math.max(this.progress, newProgress);
        this.timeSpent += additionalTimeSpent;
        this.lastReadAt = Instant.now();
        this.updatedAt = Instant.now();
        this.chapterId = chapterId;
    }

    public void endReadingSession() {
        this.endTime = Instant.now();
        this.updatedAt = Instant.now();
    }
}