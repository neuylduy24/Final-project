package com.btec.bookmanagement_api.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "bookmarks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class BookMark {
    @Id
    private String id;
    private String userId;
    private String bookId;
    private String chapterId;
}

