package com.mugisha.equipments.service;

import com.mugisha.equipments.dto.LoginResponse;
import com.mugisha.equipments.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    public LoginResponse login(String email, String password) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(email, password)
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        User user = userService.findByEmail(email);
        LoginResponse.UserDTO userDTO = new LoginResponse.UserDTO(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole()
        );
        
        return new LoginResponse("Login successful", userDTO);
    }

    public void logout() {
        SecurityContextHolder.clearContext();
    }
} 