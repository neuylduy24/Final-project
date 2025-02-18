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

}

