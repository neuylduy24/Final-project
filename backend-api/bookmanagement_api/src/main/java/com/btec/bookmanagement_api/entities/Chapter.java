package com.btec.bookmanagement_api.entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "chapters")
public class Chapter {
    @Id
    private String id;
    private String bookId;
    private int chapterNumber;
    private String title;
    private String content;
    private LocalDateTime createAt;

    public Chapter() {}

    public Chapter(String bookId, int chapterNumber, String title, String content, LocalDateTime createAt) {
        this.bookId = bookId;
        this.chapterNumber = chapterNumber;
        this.title = title;
        this.content = content;
        this.createAt = createAt;
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

    public LocalDateTime getCreateAt() {
        return createAt;
    }

    public void setCreateAt(LocalDateTime createAt) {
        this.createAt = createAt;
    }
}

