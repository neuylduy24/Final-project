package com.btec.bookmanagement_api.services;

import com.btec.bookmanagement_api.entities.Category;
import com.btec.bookmanagement_api.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Optional<Category> getCategoryById(String id) {
        return categoryRepository.findById(id);
    }

    public Optional<Category> getCategoryByName(String name) {
        return categoryRepository.findByName(name);
    }

    public boolean existsByName(String name) {
        return categoryRepository.existsByName(name);
    }

    public Category createCategory(Category category) {
        if (categoryRepository.existsByName(category.getName())) {
            throw new RuntimeException("Category with name '" + category.getName() + "' already exists!");
        }
        return categoryRepository.save(category);
    }

    public Category updateCategory(String id, Category categoryDetails) {
        return categoryRepository.findById(id).map(category -> {
            category.setName(categoryDetails.getName());
            return categoryRepository.save(category);
        }).orElseThrow(() -> new RuntimeException("Category not found with id " + id));
    }

    public void deleteCategory(String id) {
        categoryRepository.deleteById(id);
    }

//    public void deleteCategory(String name) {
//        categoryRepository.deleteByName(name);
//    }
}
