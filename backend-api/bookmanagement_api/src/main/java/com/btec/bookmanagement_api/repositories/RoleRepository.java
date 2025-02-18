package com.btec.bookmanagement_api.repositories;

import com.btec.bookmanagement_api.entities.Role;
import com.btec.bookmanagement_api.entities.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends MongoRepository<Role, String> {
    Optional<Role> findByName(String name);
}
