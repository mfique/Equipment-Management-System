package com.mugisha.equipments.controller;

import com.mugisha.equipments.model.Request;
import com.mugisha.equipments.service.RequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/requests")
public class RequestController {
    @Autowired
    private RequestService requestService;

    @GetMapping
    public List<Request> getAllRequests() {
        return requestService.getAllRequests();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Request> getRequestById(@PathVariable Long id) {
        Optional<Request> request = requestService.getRequestById(id);
        return request.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Request createRequest(@RequestBody Request request) {
        return requestService.saveRequest(request);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Request> updateRequest(@PathVariable Long id, @RequestBody Request request) {
        Optional<Request> existingRequest = requestService.getRequestById(id);
        if (existingRequest.isPresent()) {
            request.setId(id);
            return ResponseEntity.ok(requestService.saveRequest(request));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRequest(@PathVariable Long id) {
        Optional<Request> request = requestService.getRequestById(id);
        if (request.isPresent()) {
            requestService.deleteRequest(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
} 