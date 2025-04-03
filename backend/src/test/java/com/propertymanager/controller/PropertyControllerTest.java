package com.propertymanager.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.propertymanager.exception.ResourceNotFoundException;
import com.propertymanager.model.Property;
import com.propertymanager.service.PropertyService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
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
    private PropertyService propertyService;

    private Property testProperty;
    private List<Property> testProperties;
    private Page<Property> testPage;

    @BeforeEach
    void setUp() {
        testProperty = Property.builder()
            .id(1L)
            .address("123 Test St")
            .description("Test Description")
            .price(500000.0)
            .bedrooms(3)
            .bathrooms(2)
            .squareFootage(2000.0)
            .build();

        testProperties = Arrays.asList(
            testProperty,
            Property.builder()
                .id(2L)
                .address("456 Test Ave")
                .description("Another Test Description")
                .price(750000.0)
                .bedrooms(4)
                .bathrooms(3)
                .squareFootage(2500.0)
                .build()
        );

        testPage = new PageImpl<>(testProperties);
    }

    @Test
    void getAllProperties_ShouldReturnAllProperties() throws Exception {
        when(propertyService.searchProperties(eq(null), eq(null), eq(null), eq(null), any(Pageable.class)))
            .thenReturn(testPage);

        mockMvc.perform(get("/api/properties"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.content[0].id").value(testProperty.getId()))
            .andExpect(jsonPath("$.content[0].address").value(testProperty.getAddress()))
            .andExpect(jsonPath("$.content[1].id").value(testProperties.get(1).getId()))
            .andExpect(jsonPath("$.content[1].address").value(testProperties.get(1).getAddress()));
    }

    @Test
    void getPropertyById_WhenPropertyExists_ShouldReturnProperty() throws Exception {
        when(propertyService.getPropertyById(1L)).thenReturn(testProperty);

        mockMvc.perform(get("/api/properties/1"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(testProperty.getId()))
            .andExpect(jsonPath("$.address").value(testProperty.getAddress()));
    }

    @Test
    void getPropertyById_WhenPropertyDoesNotExist_ShouldReturnNotFound() throws Exception {
        when(propertyService.getPropertyById(1L))
            .thenThrow(new ResourceNotFoundException("Property", "id", 1L));

        mockMvc.perform(get("/api/properties/1"))
            .andExpect(status().isNotFound());
    }

    @Test
    void createProperty_WithValidData_ShouldCreateProperty() throws Exception {
        when(propertyService.createProperty(any(Property.class))).thenReturn(testProperty);

        mockMvc.perform(post("/api/properties")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testProperty)))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(testProperty.getId()))
            .andExpect(jsonPath("$.address").value(testProperty.getAddress()));
    }

    @Test
    void createProperty_WithInvalidData_ShouldReturnBadRequest() throws Exception {
        Property invalidProperty = Property.builder()
            .address("")  // Invalid: empty address
            .price(-1.0)  // Invalid: negative price
            .bedrooms(0)  // Invalid: zero bedrooms
            .bathrooms(0) // Invalid: zero bathrooms
            .squareFootage(0.0) // Invalid: zero square footage
            .build();

        mockMvc.perform(post("/api/properties")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidProperty)))
            .andExpect(status().isBadRequest());
    }

    @Test
    void updateProperty_WhenPropertyExists_ShouldUpdateProperty() throws Exception {
        when(propertyService.updateProperty(eq(1L), any(Property.class))).thenReturn(testProperty);

        mockMvc.perform(put("/api/properties/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testProperty)))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(testProperty.getId()))
            .andExpect(jsonPath("$.address").value(testProperty.getAddress()));
    }

    @Test
    void updateProperty_WhenPropertyDoesNotExist_ShouldReturnNotFound() throws Exception {
        when(propertyService.updateProperty(eq(1L), any(Property.class)))
            .thenThrow(new ResourceNotFoundException("Property", "id", 1L));

        mockMvc.perform(put("/api/properties/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testProperty)))
            .andExpect(status().isNotFound());
    }

    @Test
    void deleteProperty_WhenPropertyExists_ShouldDeleteProperty() throws Exception {
        doNothing().when(propertyService).deleteProperty(1L);

        mockMvc.perform(delete("/api/properties/1"))
            .andExpect(status().isNoContent());

        verify(propertyService).deleteProperty(1L);
    }

    @Test
    void deleteProperty_WhenPropertyDoesNotExist_ShouldReturnNotFound() throws Exception {
        doThrow(new ResourceNotFoundException("Property", "id", 1L))
            .when(propertyService).deleteProperty(1L);

        mockMvc.perform(delete("/api/properties/1"))
            .andExpect(status().isNotFound());
    }

    @Test
    void searchProperties_WithValidParameters_ShouldReturnFilteredProperties() throws Exception {
        when(propertyService.searchProperties(
                eq("Test St"),
                eq(400000.0),
                eq(600000.0),
                eq(3),
                any(Pageable.class)))
            .thenReturn(testPage);

        mockMvc.perform(get("/api/properties/search")
                .param("address", "Test St")
                .param("minPrice", "400000")
                .param("maxPrice", "600000")
                .param("bedrooms", "3"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.content[0].id").value(testProperty.getId()))
            .andExpect(jsonPath("$.content[0].address").value(testProperty.getAddress()));
    }

    @Test
    void searchProperties_WithInvalidParameters_ShouldReturnBadRequest() throws Exception {
        mockMvc.perform(get("/api/properties/search")
                .param("minPrice", "-1")  // Negative price
                .param("maxPrice", "0")   // Zero price
                .param("bedrooms", "-2"))  // Negative bedrooms
            .andExpect(status().isBadRequest());
    }

    @Test
    void searchProperties_WithInvalidAddressPattern_ShouldReturnBadRequest() throws Exception {
        mockMvc.perform(get("/api/properties/search")
                .param("address", "Test St!@#$%^"))  // Invalid characters
            .andExpect(status().isBadRequest());
    }

    @Test
    void searchProperties_WithInvalidPriceRange_ShouldReturnBadRequest() throws Exception {
        mockMvc.perform(get("/api/properties/search")
                .param("minPrice", "600000")  // Min price > Max price
                .param("maxPrice", "400000"))
            .andExpect(status().isBadRequest());
    }

    @Test
    void searchProperties_WithNoParameters_ShouldReturnAllProperties() throws Exception {
        when(propertyService.searchProperties(
                eq(null),
                eq(null),
                eq(null),
                eq(null),
                any(Pageable.class)))
            .thenReturn(testPage);

        mockMvc.perform(get("/api/properties/search"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.content[0].id").value(testProperty.getId()))
            .andExpect(jsonPath("$.content[0].address").value(testProperty.getAddress()));
    }
} 