package com.mugisha.equipments.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "returns")
@Data
public class Return {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long requestId;
    private LocalDateTime returnDate;
    private String condition; // "GOOD", "DAMAGED"

    public void setId(Long id) {
        this.id = id;
    }
} 