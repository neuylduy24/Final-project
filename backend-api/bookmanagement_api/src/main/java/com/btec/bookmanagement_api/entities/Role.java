package com.btec.bookmanagement_api.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Role {
    @Id
    private String id;
    @NotBlank(message = "Role name is required")
    @Pattern(regexp = "ADMIN|AUTHOR|READER", message = "Invalid role name")
    private String name;

}
