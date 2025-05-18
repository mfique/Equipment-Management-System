package com.mugisha.equipments.service;

import com.mugisha.equipments.model.AllocationLog;
import com.mugisha.equipments.repository.AllocationLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AllocationLogService {
    @Autowired
    private AllocationLogRepository allocationLogRepository;

    public List<AllocationLog> getAllLogs() {
        return allocationLogRepository.findAll();
    }

    public Optional<AllocationLog> getLogById(Long id) {
        return allocationLogRepository.findById(id);
    }

    public AllocationLog saveLog(AllocationLog log) {
        return allocationLogRepository.save(log);
    }

    public void deleteLog(Long id) {
        allocationLogRepository.deleteById(id);
    }
} 