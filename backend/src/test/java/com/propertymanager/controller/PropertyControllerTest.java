package com.propertymanager.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.propertymanager.exception.GlobalExceptionHandler;
import com.propertymanager.exception.ResourceNotFoundException;
import com.propertymanager.model.Property;
import com.propertymanager.service.PropertyService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class PropertyControllerTest {

    private MockMvc mockMvc;

    @Mock
    private PropertyService propertyService;

    @InjectMocks
    private PropertyController propertyController;

    private ObjectMapper objectMapper;
    private Property testProperty;
    private List<Property> testProperties;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        mockMvc = MockMvcBuilders.standaloneSetup(propertyController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
        
        objectMapper = new ObjectMapper();
                
        testProperty = Property.builder()
                .id(1L)
                .address("123 Test St")
                .description("Test Property")
                .price(200000.0)
                .bedrooms(3)
                .bathrooms(2)
                .squareFootage(1500.0)
                .build();

        testProperties = Arrays.asList(
                testProperty,
                Property.builder()
                        .id(2L)
                        .address("456 Test Ave")
                        .description("Another Test Property")
                        .price(300000.0)
                        .bedrooms(4)
                        .bathrooms(3)
                        .squareFootage(2000.0)
                        .build()
        );
    }

    @Test
    void getPropertyById_WhenPropertyExists_ShouldReturnProperty() throws Exception {
        when(propertyService.getPropertyById(1L)).thenReturn(testProperty);

        mockMvc.perform(get("/api/properties/1")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(testProperty.getId()))
                .andExpect(jsonPath("$.address").value(testProperty.getAddress()));
    }

    @Test
    void getPropertyById_WhenPropertyDoesNotExist_ShouldReturnNotFound() throws Exception {
        when(propertyService.getPropertyById(1L))
                .thenThrow(new ResourceNotFoundException("Property", "id", 1L));

        mockMvc.perform(get("/api/properties/1")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void createProperty_WithValidData_ShouldCreateProperty() throws Exception {
        when(propertyService.createProperty(any(Property.class))).thenReturn(testProperty);

        mockMvc.perform(post("/api/properties")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testProperty))
                        .accept(MediaType.APPLICATION_JSON))
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
                        .content(objectMapper.writeValueAsString(invalidProperty))
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateProperty_WhenPropertyExists_ShouldUpdateProperty() throws Exception {
        when(propertyService.updateProperty(eq(1L), any(Property.class))).thenReturn(testProperty);

        mockMvc.perform(put("/api/properties/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testProperty))
                        .accept(MediaType.APPLICATION_JSON))
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
                        .content(objectMapper.writeValueAsString(testProperty))
                        .accept(MediaType.APPLICATION_JSON))
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
    void searchProperties_WithPost_WithInvalidContentType_ShouldReturnBadRequest() throws Exception {
        mockMvc.perform(post("/api/properties/search")
                        .contentType(MediaType.APPLICATION_XML))
                .andExpect(status().isBadRequest());
    }
} 