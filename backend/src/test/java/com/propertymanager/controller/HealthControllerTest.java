package com.propertymanager.controller;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class HealthControllerTest {

    @Mock
    private JdbcTemplate jdbcTemplate;

    @InjectMocks
    private HealthController healthController;

    @Test
    public void shouldReturnUpWhenDatabaseIsConnected() {
        // Arrange
        when(jdbcTemplate.queryForObject(eq("SELECT 1"), eq(Integer.class))).thenReturn(1);

        // Act
        Map<String, String> response = healthController.health();

        // Assert
        assertEquals("UP", response.get("status"));
        assertEquals("Connected", response.get("database"));
    }

    @Test
    public void shouldReturnDownWhenDatabaseIsNotConnected() {
        // Arrange
        String errorMessage = "Connection refused";
        when(jdbcTemplate.queryForObject(eq("SELECT 1"), eq(Integer.class)))
                .thenThrow(new RuntimeException(errorMessage));

        // Act
        Map<String, String> response = healthController.health();

        // Assert
        assertEquals("DOWN", response.get("status"));
        assertEquals(errorMessage, response.get("error"));
    }
} 