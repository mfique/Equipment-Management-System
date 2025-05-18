package com.mugisha.equipments.repository;

import com.mugisha.equipments.model.Request;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RequestRepository extends JpaRepository<Request, Long> {
} 