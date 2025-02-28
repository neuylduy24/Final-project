package com.btec.bookmanagement_api.entities;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "books")
@Getter
@Setter
public class Book {
    @Id
    private String id;
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Author name is required")
    private String author;

    @Pattern(regexp = "^(http|https)://.*$", message = "Invalid URL format")
    private String image;
    private String description;
    private List<Chapter> chapters;
    private List<Category> categories;


    public Book() {}

    public Book(String title, String author, String image, String description, List<Chapter> chapters, List<Category> categories) {
        this.title = title;
        this.author = author;
        this.image = image;
        this.description = description;
        this.chapters = chapters;
        this.categories = categories;
    }

//    public String getId() {
//        return id;
//    }
//
//    public void setId(String id) {
//        this.id = id;
//    }
//
//    public String getTitle() {
//        return title;
//    }
//
//    public void setTitle(String title) {
//        this.title = title;
//    }
//
//    public String getAuthor() {
//        return author;
//    }
//
//    public void setAuthor(String author) {
//        this.author = author;
//    }
//
//    public String getImage() {
//        return image;
//    }
//
//    public void setImage(String image) {
//        this.image = image;
//    }
//
//    public String getDescription() {
//        return description;
//    }
//
//    public void setDescription(String description) {
//        this.description = description;
//    }
//
//    public List<Chapter> getChapters() {
//        return chapters;
//    }
//
//    public void setChapters(List<Chapter> chapters) {
//        this.chapters = chapters;
//    }
//
//    public List<Category> getCategories() {
//        return categories;
//    }
//
//    public void setCategories(List<Category> categories) {
//        this.categories = categories;
//    }
}

