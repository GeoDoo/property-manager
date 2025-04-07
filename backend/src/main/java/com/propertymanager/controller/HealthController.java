package com.propertymanager.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @Autowired
    private DataSource dataSource;
    
    @GetMapping
    public ResponseEntity<Map<String, String>> checkHealth() {
        Map<String, String> status = new HashMap<>();
        
        try (Connection connection = dataSource.getConnection()) {
            if (connection.isValid(5)) {
                status.put("status", "UP");
                status.put("database", "Connected");
            } else {
                status.put("status", "DOWN");
                status.put("database", "Not Connected");
            }
        } catch (Exception e) {
            status.put("status", "DOWN");
            status.put("database", "Error: " + e.getMessage());
        }
        
        return ResponseEntity.ok(status);
    }
} 