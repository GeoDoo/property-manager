package com.propertymanager.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.propertymanager.exception.ResourceNotFoundException;
import com.propertymanager.model.Property;
import com.propertymanager.service.PropertyService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.context.annotation.Import;
import com.propertymanager.exception.GlobalExceptionHandler;
import com.propertymanager.config.JacksonConfig;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PropertyController.class)
@Import({GlobalExceptionHandler.class, JacksonConfig.class})
public class PropertyControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PropertyService propertyService;

    @Autowired
    private ObjectMapper objectMapper;

    private Property testProperty;
    private List<Property> testProperties;

    @BeforeEach
    void setUp() {
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

    /**
     * Helper method to create a properly initialized PageImpl instance.
     */
    private <T> Page<T> createPage(List<T> content) {
        return new PageImpl<>(
            new ArrayList<>(content),
            PageRequest.of(0, 10),
            content.size()
        );
    }

    @Test
    void getAllProperties_ShouldReturnPagedProperties() throws Exception {
        Page<Property> pagedResponse = createPage(testProperties);
        
        // Use any() for all parameters including the Pageable
        when(propertyService.searchProperties(
                any(), any(), any(), any(), any(),
                any(), any(), any(), any(), any(),
                any(), any(), any(), any(Pageable.class)))
                .thenReturn(pagedResponse);

        mockMvc.perform(get("/api/properties")
                        .param("page", "0")
                        .param("size", "12")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content.length()").value(2))
                .andExpect(jsonPath("$.totalElements").value(2));
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
    void searchProperties_WithValidParameters_ShouldReturnFilteredProperties() throws Exception {
        Page<Property> pagedResponse = createPage(testProperties);
        
        // Use any() for all parameters including the Pageable
        when(propertyService.searchProperties(
                any(), any(), any(), any(), any(),
                any(), any(), any(), any(), any(),
                any(), any(), any(), any(Pageable.class)))
                .thenReturn(pagedResponse);

        mockMvc.perform(get("/api/properties/search")
                        .param("address", "123 Test St")
                        .param("minPrice", "100000")
                        .param("maxPrice", "300000")
                        .param("minRooms", "3")
                        .param("minBathrooms", "2")
                        .param("page", "0")
                        .param("size", "12")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    void searchProperties_WithInvalidAddressPattern_ShouldReturnBadRequest() throws Exception {
        mockMvc.perform(get("/api/properties/search")
                .param("address", "@#$%")
                .param("page", "0")
                .param("size", "12")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    void searchProperties_WithInvalidPriceRange_ShouldReturnBadRequest() throws Exception {
        mockMvc.perform(get("/api/properties/search")
                .param("minPrice", "300000")
                .param("maxPrice", "200000")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    void searchProperties_WithNoParameters_ShouldReturnAllProperties() throws Exception {
        Page<Property> pagedResponse = createPage(testProperties);
        
        // Use any() for all parameters including the Pageable
        when(propertyService.searchProperties(
                any(), any(), any(), any(), any(),
                any(), any(), any(), any(), any(),
                any(), any(), any(), any(Pageable.class)))
                .thenReturn(pagedResponse);

        mockMvc.perform(get("/api/properties/search")
                .param("page", "0")
                .param("size", "12")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    void searchProperties_WithInvalidBedrooms_ShouldReturnBadRequest() throws Exception {
        mockMvc.perform(get("/api/properties/search")
                .param("minRooms", "-1")
                .param("maxRooms", "-2")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    void searchProperties_WithPost_WithValidData_ShouldReturnFilteredProperties() throws Exception {
        Page<Property> pagedResponse = createPage(testProperties);
        
        // Use any() for all parameters including the Pageable
        when(propertyService.searchProperties(
                any(), any(), any(), any(), any(),
                any(), any(), any(), any(), any(),
                any(), any(), any(), any(Pageable.class)))
                .thenReturn(pagedResponse);
                
        String requestJson = "{\"address\":\"123 Test St\",\"minPrice\":100000,\"maxPrice\":300000,\"minRooms\":3}";

        mockMvc.perform(post("/api/properties/search")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestJson)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content").isArray());
    }
    
    @Test
    void searchProperties_WithPost_WithInvalidData_ShouldReturnBadRequest() throws Exception {
        String requestJson = "{\"address\":\"@#$%\",\"minPrice\":-100}";

        mockMvc.perform(post("/api/properties/search")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestJson)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }
    
    @Test
    void searchProperties_WithPost_WithInvalidContentType_ShouldReturnBadRequest() throws Exception {
        String requestXml = "<search><address>123 Test St</address></search>";
        
        mockMvc.perform(post("/api/properties/search")
                .contentType(MediaType.APPLICATION_XML)
                .content(requestXml)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }
    
    @Test
    void searchProperties_WithPost_WithEmptyBody_ShouldReturnAllProperties() throws Exception {
        Page<Property> pagedResponse = createPage(testProperties);
        
        // Use any() for all parameters including the Pageable
        when(propertyService.searchProperties(
                any(), any(), any(), any(), any(),
                any(), any(), any(), any(), any(),
                any(), any(), any(), any(Pageable.class)))
                .thenReturn(pagedResponse);

        mockMvc.perform(post("/api/properties/search")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content").isArray());
    }
} 