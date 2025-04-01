package com.propertymanager.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.propertymanager.model.Property;
import com.propertymanager.repository.PropertyRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PropertyController.class)
class PropertyControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PropertyRepository propertyRepository;

    private Property testProperty;

    @BeforeEach
    void setUp() {
        testProperty = new Property();
        testProperty.setId(1L);
        testProperty.setAddress("123 Test St");
        testProperty.setPrice(new BigDecimal("250000.00").doubleValue());
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
        Property savedProperty = new Property();
        savedProperty.setId(1L);
        savedProperty.setAddress(testProperty.getAddress());
        savedProperty.setPrice(testProperty.getPrice());
        savedProperty.setBedrooms(testProperty.getBedrooms());
        savedProperty.setBathrooms(testProperty.getBathrooms());
        savedProperty.setSquareFootage(testProperty.getSquareFootage());

        when(propertyRepository.save(any(Property.class))).thenReturn(savedProperty);

        mockMvc.perform(post("/api/properties")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testProperty)))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.address").value(testProperty.getAddress()));
    }

    @Test
    void updateProperty_WhenExists_ShouldReturnUpdatedProperty() throws Exception {
        when(propertyRepository.findById(1L)).thenReturn(Optional.of(testProperty));
        when(propertyRepository.save(any(Property.class))).thenReturn(testProperty);

        testProperty.setPrice(new BigDecimal("260000.00").doubleValue());

        mockMvc.perform(put("/api/properties/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testProperty)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.price").value(260000.00));
    }

    @Test
    void updateProperty_WhenNotExists_ShouldReturn404() throws Exception {
        when(propertyRepository.findById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(put("/api/properties/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testProperty)))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteProperty_WhenExists_ShouldReturn204() throws Exception {
        Long propertyId = 1L;
        when(propertyRepository.existsById(propertyId)).thenReturn(true);

        mockMvc.perform(delete("/api/properties/{id}", propertyId))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(status().isNoContent());

        verify(propertyRepository).existsById(propertyId);
        verify(propertyRepository).deleteById(propertyId);
    }

    @Test
    void deleteProperty_WhenNotExists_ShouldReturn404() throws Exception {
        when(propertyRepository.existsById(1L)).thenReturn(false);

        mockMvc.perform(delete("/api/properties/1"))
                .andExpect(status().isNotFound());

        verify(propertyRepository, never()).deleteById(any());
    }
} 