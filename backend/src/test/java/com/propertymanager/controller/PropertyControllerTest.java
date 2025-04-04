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
import org.springframework.context.annotation.Import;
import com.propertymanager.exception.GlobalExceptionHandler;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PropertyController.class)
@Import(GlobalExceptionHandler.class)
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

    @Test
    void getAllProperties_ShouldReturnPagedProperties() throws Exception {
        Page<Property> pagedResponse = new PageImpl<>(testProperties);
        when(propertyService.searchProperties(
                null, null, null, null, null,
                null, null, null, null, null,
                null, null, null, any(Pageable.class)))
                .thenReturn(pagedResponse);

        mockMvc.perform(get("/api/properties")
                        .param("page", "0")
                        .param("size", "12"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content.length()").value(2))
                .andExpect(jsonPath("$.totalElements").value(2));
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
                .thenThrow(new ResourceNotFoundException("Property", "id", "1"));

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
                .thenThrow(new ResourceNotFoundException("Property", "id", "1"));

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
        doThrow(new ResourceNotFoundException("Property", "id", "1"))
                .when(propertyService).deleteProperty(1L);

        mockMvc.perform(delete("/api/properties/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    void searchProperties_WithValidParameters_ShouldReturnFilteredProperties() throws Exception {
        Page<Property> pagedResponse = new PageImpl<>(testProperties);
        when(propertyService.searchProperties(
                eq("123 Test St"),
                eq(100000.0),
                eq(300000.0),
                null, null,
                eq(3),
                null,
                eq(2),
                null,
                null, null,
                null, null,
                any(Pageable.class)))
                .thenReturn(pagedResponse);

        mockMvc.perform(get("/api/properties/search")
                        .param("address", "123 Test St")
                        .param("minPrice", "100000")
                        .param("maxPrice", "300000")
                        .param("minRooms", "3")
                        .param("minBathrooms", "2")
                        .param("page", "0")
                        .param("size", "12"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    void searchProperties_WithInvalidAddressPattern_ShouldReturnBadRequest() throws Exception {
        mockMvc.perform(get("/api/properties/search")
                .param("address", "@#$%")
                .param("page", "0")
                .param("size", "12"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void searchProperties_WithInvalidPriceRange_ShouldReturnBadRequest() throws Exception {
        mockMvc.perform(get("/api/properties/search")
                .param("minPrice", "300000")
                .param("maxPrice", "200000"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void searchProperties_WithNoParameters_ShouldReturnAllProperties() throws Exception {
        Page<Property> pagedResponse = new PageImpl<>(testProperties);
        when(propertyService.searchProperties(
                null, null, null, null, null,
                null, null, null, null, null,
                null, null, null, any(Pageable.class)))
                .thenReturn(pagedResponse);

        mockMvc.perform(get("/api/properties/search")
                .param("page", "0")
                .param("size", "12"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    void searchProperties_WithInvalidBedrooms_ShouldReturnBadRequest() throws Exception {
        mockMvc.perform(get("/api/properties/search")
                .param("minRooms", "-1")
                .param("maxRooms", "-2"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getAllProperties_WithInvalidPageSize_ShouldUseDefaultSize() throws Exception {
        Page<Property> pagedResponse = new PageImpl<>(testProperties);
        when(propertyService.searchProperties(eq(null), eq(null), eq(null), eq(null), any(Pageable.class)))
                .thenReturn(pagedResponse);

        mockMvc.perform(get("/api/properties")
                        .param("page", "0")
                        .param("size", "100"))  // Invalid size
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content.length()").value(2));
    }

    @Test
    void createProperty_WithNullValues_ShouldReturnBadRequest() throws Exception {
        Property invalidProperty = new Property();  // All fields null

        mockMvc.perform(post("/api/properties")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidProperty)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createProperty_WithMaxValues_ShouldCreateProperty() throws Exception {
        Property maxProperty = Property.builder()
                .address("123 Test St")
                .description("Test Property")
                .price(Double.MAX_VALUE)
                .bedrooms(Integer.MAX_VALUE)
                .bathrooms(Integer.MAX_VALUE)
                .squareFootage(Double.MAX_VALUE)
                .build();

        when(propertyService.createProperty(any(Property.class))).thenReturn(maxProperty);

        mockMvc.perform(post("/api/properties")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(maxProperty)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.price").value(Double.MAX_VALUE))
                .andExpect(jsonPath("$.bedrooms").value(Integer.MAX_VALUE));
    }

    @Test
    void searchProperties_WithOnlyAddressAndBedrooms_ShouldReturnFilteredProperties() throws Exception {
        Page<Property> pagedResponse = new PageImpl<>(testProperties);
        when(propertyService.searchProperties(
                eq("123 Test St"),
                null, null, null, null,
                eq(3), null, null, null,
                null, null, null, null,
                any(Pageable.class)))
                .thenReturn(pagedResponse);

        mockMvc.perform(get("/api/properties/search")
                .param("address", "123 Test St")
                .param("minRooms", "3")
                .param("page", "0")
                .param("size", "12"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    void searchProperties_WithOnlyPriceRange_ShouldReturnFilteredProperties() throws Exception {
        Page<Property> pagedResponse = new PageImpl<>(testProperties);
        when(propertyService.searchProperties(
                null,
                eq(200000.0),
                eq(400000.0),
                null, null, null, null,
                null, null, null, null,
                null, null,
                any(Pageable.class)))
                .thenReturn(pagedResponse);

        mockMvc.perform(get("/api/properties/search")
                .param("minPrice", "200000")
                .param("maxPrice", "400000")
                .param("page", "0")
                .param("size", "12"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    void updateProperty_WithNullValues_ShouldReturnBadRequest() throws Exception {
        Property invalidProperty = new Property();  // All fields null

        mockMvc.perform(put("/api/properties/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidProperty)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getAllProperties_WithNegativePage_ShouldUseFirstPage() throws Exception {
        Page<Property> pagedResponse = new PageImpl<>(testProperties);
        when(propertyService.searchProperties(
                eq(null),
                eq(null),
                eq(null),
                eq(null),
                any(Pageable.class)))
                .thenReturn(pagedResponse);

        mockMvc.perform(get("/api/properties")
                        .param("page", "-1")
                        .param("size", "12"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content.length()").value(2));
    }

    @Test
    void createProperty_WithExcessiveLength_ShouldReturnBadRequest() throws Exception {
        Property property = Property.builder()
                .address("a".repeat(1001))  // Exceeds 1000 characters
                .description("Test Description")
                .price(500000.0)
                .bedrooms(3)
                .bathrooms(2)
                .squareFootage(2000.0)
                .build();

        mockMvc.perform(post("/api/properties")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(property)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateProperty_WithMissingRequiredFields_ShouldReturnBadRequest() throws Exception {
        Property invalidProperty = Property.builder()
                .id(1L)
                .description("Test Property")
                .price(200000.0)
                .bedrooms(3)
                .bathrooms(2)
                .squareFootage(1500.0)
                .build();  // Missing address

        mockMvc.perform(put("/api/properties/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidProperty)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void searchProperties_WithInvalidNumberFormat_ShouldReturnBadRequest() throws Exception {
        mockMvc.perform(get("/api/properties/search")
                .param("minPrice", "invalid")
                .param("maxPrice", "invalid")
                .param("minSize", "invalid")
                .param("maxSize", "invalid")
                .param("minRooms", "invalid")
                .param("maxRooms", "invalid")
                .param("minBathrooms", "invalid")
                .param("maxBathrooms", "invalid")
                .param("minYearBuilt", "invalid")
                .param("maxYearBuilt", "invalid")
                .param("minLotSize", "invalid")
                .param("maxLotSize", "invalid"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void searchProperties_WithAllValidParameters_ShouldReturnFilteredProperties() throws Exception {
        Page<Property> pagedResponse = new PageImpl<>(testProperties);
        when(propertyService.searchProperties(
                eq("123 Test St"),
                eq(200000.0),
                eq(400000.0),
                eq(1500.0),
                eq(2500.0),
                eq(3),
                eq(5),
                eq(2),
                eq(3),
                eq(2000),
                eq(2023),
                eq(1000.0),
                eq(2000.0),
                any(Pageable.class)))
                .thenReturn(pagedResponse);

        mockMvc.perform(get("/api/properties/search")
                .param("address", "123 Test St")
                .param("minPrice", "200000")
                .param("maxPrice", "400000")
                .param("minSize", "1500")
                .param("maxSize", "2500")
                .param("minRooms", "3")
                .param("maxRooms", "5")
                .param("minBathrooms", "2")
                .param("maxBathrooms", "3")
                .param("minYearBuilt", "2000")
                .param("maxYearBuilt", "2023")
                .param("minLotSize", "1000")
                .param("maxLotSize", "2000")
                .param("page", "0")
                .param("size", "12"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    void createProperty_WithInvalidContentType_ShouldReturnBadRequest() throws Exception {
        mockMvc.perform(post("/api/properties")
                        .contentType(MediaType.TEXT_PLAIN)
                        .content("invalid content"))
                .andExpect(status().isUnsupportedMediaType());
    }

    @Test
    void updateProperty_WithInvalidContentType_ShouldReturnBadRequest() throws Exception {
        mockMvc.perform(put("/api/properties/1")
                        .contentType(MediaType.TEXT_PLAIN)
                        .content("invalid content"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getPropertyById_WithInvalidIdFormat_ShouldReturnBadRequest() throws Exception {
        mockMvc.perform(get("/api/properties/invalid-id"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deleteProperty_WithInvalidIdFormat_ShouldReturnBadRequest() throws Exception {
        mockMvc.perform(delete("/api/properties/invalid-id"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void searchProperties_WithInvalidContentType_ShouldReturnBadRequest() throws Exception {
        mockMvc.perform(get("/api/properties/search")
                .contentType(MediaType.APPLICATION_XML)
                .param("minPrice", "200000")
                .param("maxPrice", "400000"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void searchProperties_WithAllParameters_ShouldReturnFilteredProperties() throws Exception {
        Page<Property> pagedResponse = new PageImpl<>(testProperties);
        when(propertyService.searchProperties(
                eq("123 Test St"),
                eq(200000.0),
                eq(400000.0),
                eq(1500.0),
                eq(2500.0),
                eq(3),
                eq(5),
                eq(2),
                eq(3),
                eq(2000),
                eq(2023),
                eq(1000.0),
                eq(2000.0),
                any(Pageable.class)))
                .thenReturn(pagedResponse);

        mockMvc.perform(get("/api/properties/search")
                .param("address", "123 Test St")
                .param("minPrice", "200000")
                .param("maxPrice", "400000")
                .param("minSize", "1500")
                .param("maxSize", "2500")
                .param("minRooms", "3")
                .param("maxRooms", "5")
                .param("minBathrooms", "2")
                .param("maxBathrooms", "3")
                .param("minYearBuilt", "2000")
                .param("maxYearBuilt", "2023")
                .param("minLotSize", "1000")
                .param("maxLotSize", "2000")
                .param("page", "0")
                .param("size", "12"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content").isArray());
    }
} 