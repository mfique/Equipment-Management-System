package com.mugisha.equipments.controller;

import com.mugisha.equipments.model.Return;
import com.mugisha.equipments.service.ReturnService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/returns")
public class ReturnController {
    @Autowired
    private ReturnService returnService;

    @GetMapping
    public List<Return> getAllReturns() {
        return returnService.getAllReturns();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Return> getReturnById(@PathVariable Long id) {
        Optional<Return> ret = returnService.getReturnById(id);
        return ret.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Return createReturn(@RequestBody Return ret) {
        return returnService.saveReturn(ret);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Return> updateReturn(@PathVariable Long id, @RequestBody Return ret) {
        Optional<Return> existingReturn = returnService.getReturnById(id);
        if (existingReturn.isPresent()) {
            ret.setId(id);
            return ResponseEntity.ok(returnService.saveReturn(ret));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReturn(@PathVariable Long id) {
        Optional<Return> ret = returnService.getReturnById(id);
        if (ret.isPresent()) {
            returnService.deleteReturn(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
} 