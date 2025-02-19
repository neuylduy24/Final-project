package com.btec.bookmanagement_api.entities;

import jakarta.persistence.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "bookmarks")
public class BookMark {
    @Id
    private String id;
    private String userId;
    private String bookId;
    private String chapterId;

    public BookMark() {}

    public BookMark(String userId, String bookId, String chapterId) {
        this.userId = userId;
        this.bookId = bookId;
        this.chapterId = chapterId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getBookId() {
        return bookId;
    }

    public void setBookId(String bookId) {
        this.bookId = bookId;
    }

    public String getChapterId() {
        return chapterId;
    }

    public void setChapterId(String chapterId) {
        this.chapterId = chapterId;
    }
}

