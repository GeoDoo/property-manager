package com.propertymanager.controller;

import com.propertymanager.model.Property;
import com.propertymanager.service.PropertyService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PropertyControllerTest {

    @Mock
    private PropertyService propertyService;

    @InjectMocks
    private PropertyController propertyController;

    private Property testProperty;
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

        List<Property> properties = List.of(testProperty);
        testPage = new PageImpl<>(properties);
    }

    @Test
    void getAllProperties_ShouldReturnPageOfProperties() {
        // Given
        Pageable pageable = PageRequest.of(0, 12);
        when(propertyService.searchProperties(null, null, null, null, pageable))
            .thenReturn(testPage);

        // When
        Page<Property> result = propertyController.getAllProperties(pageable);

        // Then
        assertThat(result).isEqualTo(testPage);
        verify(propertyService).searchProperties(null, null, null, null, pageable);
    }

    @Test
    void getPropertyById_ShouldReturnProperty() {
        // Given
        when(propertyService.getPropertyById(1L)).thenReturn(testProperty);

        // When
        Property result = propertyController.getPropertyById(1L);

        // Then
        assertThat(result).isEqualTo(testProperty);
        verify(propertyService).getPropertyById(1L);
    }

    @Test
    void createProperty_ShouldReturnCreatedProperty() {
        // Given
        when(propertyService.createProperty(any(Property.class))).thenReturn(testProperty);

        // When
        Property result = propertyController.createProperty(testProperty);

        // Then
        assertThat(result).isEqualTo(testProperty);
        verify(propertyService).createProperty(testProperty);
    }

    @Test
    void updateProperty_ShouldReturnUpdatedProperty() {
        // Given
        when(propertyService.updateProperty(eq(1L), any(Property.class))).thenReturn(testProperty);

        // When
        Property result = propertyController.updateProperty(1L, testProperty);

        // Then
        assertThat(result).isEqualTo(testProperty);
        verify(propertyService).updateProperty(1L, testProperty);
    }

    @Test
    void deleteProperty_ShouldReturnNoContent() {
        // When
        ResponseEntity<Void> result = propertyController.deleteProperty(1L);

        // Then
        assertThat(result.getStatusCodeValue()).isEqualTo(204);
        verify(propertyService).deleteProperty(1L);
    }

    @Test
    void searchProperties_ShouldReturnFilteredProperties() {
        // Given
        String address = "Test";
        Double minPrice = 400000.0;
        Double maxPrice = 600000.0;
        Integer bedrooms = 3;
        Pageable pageable = PageRequest.of(0, 12);

        when(propertyService.searchProperties(address, minPrice, maxPrice, bedrooms, pageable))
            .thenReturn(testPage);

        // When
        ResponseEntity<?> result = propertyController.searchProperties(
            address, minPrice, maxPrice, bedrooms, pageable);

        // Then
        assertThat(result.getStatusCodeValue()).isEqualTo(200);
        assertThat(result.getBody()).isEqualTo(testPage);
        verify(propertyService).searchProperties(address, minPrice, maxPrice, bedrooms, pageable);
    }

    @Test
    void searchProperties_WithInvalidParameters_ShouldReturnBadRequest() {
        // Given
        String address = "Test";
        Double minPrice = 600000.0;
        Double maxPrice = 400000.0; // Invalid: max < min
        Integer bedrooms = 3;
        Pageable pageable = PageRequest.of(0, 12);

        when(propertyService.searchProperties(address, minPrice, maxPrice, bedrooms, pageable))
            .thenThrow(new IllegalArgumentException("Maximum price must be greater than minimum price"));

        // When
        ResponseEntity<?> result = propertyController.searchProperties(
            address, minPrice, maxPrice, bedrooms, pageable);

        // Then
        assertThat(result.getStatusCodeValue()).isEqualTo(400);
        assertThat(result.getBody()).isInstanceOf(Map.class);
        @SuppressWarnings("unchecked")
        Map<String, String> errorMap = (Map<String, String>) result.getBody();
        assertThat(errorMap).containsKey("error");
        assertThat(errorMap.get("error")).isEqualTo("Maximum price must be greater than minimum price");
    }
} 