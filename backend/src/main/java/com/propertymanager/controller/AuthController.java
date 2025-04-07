package com.propertymanager.controller;

import com.propertymanager.model.AuthRequest;
import com.propertymanager.model.User;
import com.propertymanager.repository.UserRepository;
import com.propertymanager.security.JwtTokenUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request) {
        try {
            // Find user in the database
            User user = userRepository.findByUsername(request.getUsername())
                    .orElseThrow(() -> new BadCredentialsException("Invalid username or password"));
                    
            // Check password
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid username or password"));
            }
            
            // Create authentication
            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    user.getUsername(), null, null);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            // Check if user has admin role
            boolean isAdmin = user.getRole() != null && user.getRole().equals("ROLE_ADMIN");
            
            // Generate JWT token
            String token = jwtTokenUtil.generateToken(user.getUsername(), isAdmin);
            
            // Create response
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("username", user.getUsername());
            response.put("isAdmin", isAdmin);
            
            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid username or password"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal server error"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody User userRequest) {
        if (userRepository.existsByUsername(userRequest.getUsername())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username already exists"));
        }
        
        userRequest.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        
        // By default, new users are not admins
        if (userRequest.getRole() == null) {
            userRequest.setRole("ROLE_USER");
        }
        
        User savedUser = userRepository.save(userRequest);
        
        // Don't return the password in the response
        savedUser.setPassword(null);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }
} 