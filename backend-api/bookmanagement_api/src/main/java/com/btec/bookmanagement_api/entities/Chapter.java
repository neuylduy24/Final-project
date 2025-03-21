package com.btec.bookmanagement_api.entities;


import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "chapters")
@Getter
@Setter
public class Chapter {
    @Id
    private String id;
    private String bookId;
    @NotNull(message = "ChapterNumber is required")
    private Double chapterNumber;
    private String title;
    private List<String> images;
    private String content;
    @CreatedDate
    private LocalDateTime createdAt;
    private int views = 0 ;

    public void incrementViews() {
        this.views++;
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

