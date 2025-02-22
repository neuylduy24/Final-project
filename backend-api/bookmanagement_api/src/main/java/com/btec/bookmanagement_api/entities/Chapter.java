package com.btec.bookmanagement_api.entities;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "chapters")
public class Chapter {
    @Id
    private String id;
    private String bookId;
    @NotBlank(message = "ChapterNumber is required")
    private int chapterNumber;
    private String title;
    @NotBlank(message = "Content is required")
    @Min(value = 300, message = "Content must be at least 300 characters")
    private String content;
    @CreatedDate
    private LocalDateTime createdAt;

    public Chapter() {}

    public Chapter(String bookId, int chapterNumber, String title, String content, LocalDateTime createdAt) {
        this.bookId = bookId;
        this.chapterNumber = chapterNumber;
        this.title = title;
        this.content = content;
        this.createdAt = createdAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getBookId() {
        return bookId;
    }

    public void setBookId(String bookId) {
        this.bookId = bookId;
    }

    public int getChapterNumber() {
        return chapterNumber;
    }

    public void setChapterNumber(int chapterNumber) {
        this.chapterNumber = chapterNumber;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "Chapter{" +
                "id='" + id + '\'' +
                ", bookId='" + bookId + '\'' +
                ", chapterNumber=" + chapterNumber +
                ", title='" + title + '\'' +
                ", content='" + content + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}

