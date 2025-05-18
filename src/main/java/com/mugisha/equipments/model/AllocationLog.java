package com.mugisha.equipments.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "allocation_logs")
@Data
public class AllocationLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long equipmentId;
    private Long userId;
    private LocalDateTime allocatedAt;
    private String action; // "ALLOCATED", "RETURNED"

    public void setId(Long id) {
        this.id = id;
    }
} 