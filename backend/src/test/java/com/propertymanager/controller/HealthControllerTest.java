package com.propertymanager.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import javax.sql.DataSource;
import java.sql.Connection;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class HealthControllerTest {

    @Mock
    private DataSource dataSource;

    @Mock
    private Connection connection;

    @InjectMocks
    private HealthController healthController;

    @BeforeEach
    public void setup() throws Exception {
        when(dataSource.getConnection()).thenReturn(connection);
    }

    @Test
    public void shouldReturnUpWhenDatabaseIsConnected() throws Exception {
        // Arrange
        when(connection.isValid(5)).thenReturn(true);

        // Act
        ResponseEntity<Map<String, String>> responseEntity = healthController.checkHealth();
        Map<String, String> response = responseEntity.getBody();

        // Assert
        assertEquals("UP", response.get("status"));
        assertEquals("Connected", response.get("database"));
    }

    @Test
    public void shouldReturnDownWhenDatabaseIsNotConnected() throws Exception {
        // Arrange
        String errorMessage = "Connection refused";
        when(connection.isValid(5)).thenReturn(false);

        // Act
        ResponseEntity<Map<String, String>> responseEntity = healthController.checkHealth();
        Map<String, String> response = responseEntity.getBody();

        // Assert
        assertEquals("DOWN", response.get("status"));
        assertEquals("Not Connected", response.get("database"));
    }
    
    @Test
    public void shouldReturnDownWhenDatabaseThrowsException() throws Exception {
        // Arrange
        String errorMessage = "Connection refused";
        when(connection.isValid(5)).thenThrow(new RuntimeException(errorMessage));

        // Act
        ResponseEntity<Map<String, String>> responseEntity = healthController.checkHealth();
        Map<String, String> response = responseEntity.getBody();

        // Assert
        assertEquals("DOWN", response.get("status"));
        assertEquals("Error: " + errorMessage, response.get("database"));
    }
} 