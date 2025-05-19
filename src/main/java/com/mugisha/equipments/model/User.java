package com.mugisha.equipments.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import lombok.Data;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role; // "ADMIN" or "STAFF"

    public void setId(Long id) {
        this.id = id;
    }

    public void setPassword(String password) {
        // Hash the password if it's not already hashed
        if (password != null && !password.startsWith("$2a$")) {
            this.password = new BCryptPasswordEncoder().encode(password);
        } else {
            this.password = password;
        }
    }
} 