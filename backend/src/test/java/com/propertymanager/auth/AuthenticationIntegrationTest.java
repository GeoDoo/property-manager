package com.propertymanager.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.propertymanager.model.AuthRequest;
import com.propertymanager.model.Property;
import com.propertymanager.model.User;
import com.propertymanager.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration test specifically for testing authentication with security enabled.
 */
@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {"app.auth.enabled=true"})
public class AuthenticationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    private static final String ADMIN_USERNAME = "testadmin";
    private static final String ADMIN_PASSWORD = "testpassword";
    private String adminToken;

    @BeforeEach
    void setUp() throws Exception {
        // Create admin user if doesn't exist
        if (!userRepository.existsByUsername(ADMIN_USERNAME)) {
            User admin = User.builder()
                    .username(ADMIN_USERNAME)
                    .password(passwordEncoder.encode(ADMIN_PASSWORD))
                    .role("ROLE_ADMIN")
                    .build();
            userRepository.save(admin);
        }
        
        // Login and get token
        AuthRequest authRequest = new AuthRequest(ADMIN_USERNAME, ADMIN_PASSWORD);
        
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isOk())
                .andReturn();
        
        String response = result.getResponse().getContentAsString();
        adminToken = objectMapper.readTree(response).get("token").asText();
    }

    @Test
    void publicEndpoint_ShouldWork_WithoutAuthentication() throws Exception {
        // GET /api/properties is public
        mockMvc.perform(get("/api/properties"))
                .andExpect(status().isOk());
    }
    
    @Test
    void protectedEndpoint_ShouldReturn403_WithoutAuthentication() throws Exception {
        // POST /api/properties requires authentication
        Property property = Property.builder()
                .address("123 Test Street")
                .description("Test Property")
                .price(250000.0)
                .bedrooms(3)
                .bathrooms(2)
                .squareFootage(1800.0)
                .build();
                
        mockMvc.perform(post("/api/properties")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(property)))
                .andExpect(status().isForbidden());
    }
    
    @Test
    void protectedEndpoint_ShouldWork_WithAuthentication() throws Exception {
        // POST /api/properties works with auth
        Property property = Property.builder()
                .address("123 Test Street")
                .description("Test Property")
                .price(250000.0)
                .bedrooms(3)
                .bathrooms(2)
                .squareFootage(1800.0)
                .build();
                
        mockMvc.perform(post("/api/properties")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(property)))
                .andExpect(status().isOk());
    }
} 