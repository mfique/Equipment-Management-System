package com.mugisha.equipments.repository;

import com.mugisha.equipments.model.Equipment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EquipmentRepository extends JpaRepository<Equipment, Long> {
} 