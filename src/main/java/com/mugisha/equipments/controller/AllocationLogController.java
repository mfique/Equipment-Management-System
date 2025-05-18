package com.mugisha.equipments.controller;

import com.mugisha.equipments.model.AllocationLog;
import com.mugisha.equipments.service.AllocationLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/logs")
public class AllocationLogController {
    @Autowired
    private AllocationLogService allocationLogService;

    @GetMapping
    public List<AllocationLog> getAllLogs() {
        return allocationLogService.getAllLogs();
    }

    @GetMapping("/{id}")
    public ResponseEntity<AllocationLog> getLogById(@PathVariable Long id) {
        Optional<AllocationLog> log = allocationLogService.getLogById(id);
        return log.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public AllocationLog createLog(@RequestBody AllocationLog log) {
        return allocationLogService.saveLog(log);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AllocationLog> updateLog(@PathVariable Long id, @RequestBody AllocationLog log) {
        Optional<AllocationLog> existingLog = allocationLogService.getLogById(id);
        if (existingLog.isPresent()) {
            log.setId(id);
            return ResponseEntity.ok(allocationLogService.saveLog(log));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLog(@PathVariable Long id) {
        Optional<AllocationLog> log = allocationLogService.getLogById(id);
        if (log.isPresent()) {
            allocationLogService.deleteLog(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
} 