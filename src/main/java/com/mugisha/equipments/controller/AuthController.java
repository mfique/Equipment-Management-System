package com.mugisha.equipments.controller;

import com.mugisha.equipments.dto.LoginRequest;
import com.mugisha.equipments.dto.LoginResponse;
import com.mugisha.equipments.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        LoginResponse response = authService.login(loginRequest.getEmail(), loginRequest.getPassword());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<LoginResponse> logout() {
        authService.logout();
        return ResponseEntity.ok(new LoginResponse("Logout successful", null));
    }

    @GetMapping("/current-user")
    public ResponseEntity<LoginResponse> getCurrentUser(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            LoginResponse response = authService.login(authentication.getName(), "");
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(401).body(new LoginResponse("Not authenticated", null));
    }
}
