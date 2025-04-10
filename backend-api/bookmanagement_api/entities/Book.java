package com.btec.bookmanagement_api.entities;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "books")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Book {
    @Id
    private String id;
    @NotBlank(message = "Title is required")
    private String title;
    private String author;

    @Pattern(regexp = "^(http|https)://.*$", message = "Invalid URL format")
    private String image;
    private byte[] imageData;
    @Indexed
    private String imageHash;
    private String description;

    private List<Category> categories;
    private int views = 0 ;
    @Transient  // Không lưu vào MongoDB
    private List<Feedback> feedbacks;
    @CreatedDate
    private LocalDateTime createdAt;

    @Transient
    private double averageRating;
    @Transient
    private long totalFollows;

}

