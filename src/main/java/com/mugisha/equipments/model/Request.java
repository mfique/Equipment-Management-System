package com.mugisha.equipments.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "requests")
@Data
public class Request {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private Long equipmentId;
    private String purpose;
    private String requestDetails;
    private String status; // "PENDING", "APPROVED", "REJECTED"

    public void setId(Long id) {
        this.id = id;
    }
}