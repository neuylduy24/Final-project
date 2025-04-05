package com.btec.bookmanagement_api.controllers;

import com.btec.bookmanagement_api.entities.Category;
import com.btec.bookmanagement_api.repositories.CategoryRepository;
import com.btec.bookmanagement_api.services.CategoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;
    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable String id) {
        return categoryService.getCategoryById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createCategory(@RequestBody @Valid Category category) {
        try {
            return ResponseEntity.ok(categoryService.createCategory(category));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable String id, @RequestBody Category categoryDetails) {
        try {
            return ResponseEntity.ok(categoryService.updateCategory(id, categoryDetails));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable String id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
    @DeleteMapping("/by-name/{name}")
    public ResponseEntity<?> deleteCategoryByName(@PathVariable String name) {
        categoryRepository.deleteByName(name);
        return ResponseEntity.ok("Category deleted successfully");
    }
//    @DeleteMapping("/{name}")
//    public ResponseEntity<Void> deleteCategory(@PathVariable String name) {
//        categoryService.deleteCategory(name);
//        return ResponseEntity.noContent().build();
//    }
}
