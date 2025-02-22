package com.btec.bookmanagement_api.entities;

import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "categories")
public class Category {
    @Id
    private String id;
    @NotBlank(message = "Category name is required")
    private String name;

    public Category() {}

    public Category(String name) {
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}