package com.mugisha.equipments.repository;

import com.mugisha.equipments.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
} 