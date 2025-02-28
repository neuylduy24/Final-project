package com.btec.bookmanagement_api.entities;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "chapters")
public class Chapter {
    @Id
    private String id;
    private String bookId;
    @NotBlank(message = "ChapterNumber is required")
    private double chapterNumber;
    private String title;
    private List<String> images;
    private String content;
    private int views = 0;
    @CreatedDate
    private LocalDateTime createdAt;

    public Chapter() {}


    public Chapter(String bookId, double chapterNumber, String title, String content, LocalDateTime createdAt) {
        this.bookId = bookId;
        this.chapterNumber = chapterNumber;
        this.title = title;
        this.content = content;
        this.views = 0;
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

    public double getChapterNumber() {
        return chapterNumber;
    }

    public void setChapterNumber(double chapterNumber) {
        this.chapterNumber = chapterNumber;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
    public int getViews() {
        return views;
    }

    public void setViews(int views) {
        this.views = views;
    }

    public void incrementViews() {
        this.views++;
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

