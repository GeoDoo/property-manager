package com.propertymanager.controller;

import com.propertymanager.entity.Property;
import com.propertymanager.repository.PropertyRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PropertyController.class)
class PropertyControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PropertyRepository propertyRepository;

    private Property testProperty;

    @BeforeEach
    void setUp() {
        testProperty = new Property();
        testProperty.setId(1L);
        testProperty.setAddress("123 Test St");
        testProperty.setPrice(new BigDecimal("250000.00"));
        testProperty.setBedrooms(3);
        testProperty.setBathrooms(2);
        testProperty.setSquareFootage(2000.0);
    }

    @Test
    void getAllProperties_ShouldReturnProperties() throws Exception {
        when(propertyRepository.findAll()).thenReturn(Arrays.asList(testProperty));

        mockMvc.perform(get("/api/properties"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].address").value(testProperty.getAddress()));
    }

    @Test
    void getPropertyById_WhenExists_ShouldReturnProperty() throws Exception {
        when(propertyRepository.findById(1L)).thenReturn(Optional.of(testProperty));

        mockMvc.perform(get("/api/properties/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.address").value(testProperty.getAddress()));
    }

    @Test
    void getPropertyById_WhenNotExists_ShouldReturn404() throws Exception {
        when(propertyRepository.findById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/properties/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    void createProperty_ShouldReturnCreatedProperty() throws Exception {
        when(propertyRepository.save(any(Property.class))).thenReturn(testProperty);

        mockMvc.perform(post("/api/properties")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"address\":\"123 Test St\",\"price\":250000.00,\"bedrooms\":3,\"bathrooms\":2,\"squareFootage\":2000.0}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.address").value(testProperty.getAddress()));
    }
} 