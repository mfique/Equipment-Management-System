package com.mugisha.equipments.service;

import com.mugisha.equipments.model.Return;
import com.mugisha.equipments.repository.ReturnRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReturnService {
    @Autowired
    private ReturnRepository returnRepository;

    public List<Return> getAllReturns() {
        return returnRepository.findAll();
    }

    public Optional<Return> getReturnById(Long id) {
        return returnRepository.findById(id);
    }

    public Return saveReturn(Return ret) {
        return returnRepository.save(ret);
    }

    public void deleteReturn(Long id) {
        returnRepository.deleteById(id);
    }
} 