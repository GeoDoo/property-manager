package com.propertymanager.service;

import com.propertymanager.exception.ResourceNotFoundException;
import com.propertymanager.model.Property;
import com.propertymanager.repository.PropertyRepository;
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
import org.springframework.data.jpa.domain.Specification;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PropertyServiceImplTest {

    @Mock
    private PropertyRepository propertyRepository;

    @InjectMocks
    private PropertyServiceImpl propertyService;

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
    void getAllProperties_ShouldReturnAllProperties() {
        // Given
        when(propertyRepository.findAll()).thenReturn(testProperties);

        // When
        List<Property> result = propertyService.getAllProperties();

        // Then
        assertThat(result).isEqualTo(testProperties);
        verify(propertyRepository).findAll();
    }

    @Test
    void getPropertyById_WhenPropertyExists_ShouldReturnProperty() {
        // Given
        when(propertyRepository.findById(1L)).thenReturn(Optional.of(testProperty));

        // When
        Property result = propertyService.getPropertyById(1L);

        // Then
        assertThat(result).isEqualTo(testProperty);
        verify(propertyRepository).findById(1L);
    }

    @Test
    void getPropertyById_WhenPropertyDoesNotExist_ShouldThrowException() {
        // Given
        when(propertyRepository.findById(1L)).thenReturn(Optional.empty());

        // When/Then
        assertThatThrownBy(() -> propertyService.getPropertyById(1L))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessageContaining("Property")
            .hasMessageContaining("id")
            .hasMessageContaining("1");
    }

    @Test
    void createProperty_WithValidData_ShouldCreateProperty() {
        // Given
        Property newProperty = Property.builder()
            .address("789 New St")
            .description("New Description")
            .price(600000.0)
            .bedrooms(3)
            .bathrooms(2)
            .squareFootage(2000.0)
            .build();

        when(propertyRepository.save(any(Property.class))).thenReturn(newProperty);

        // When
        Property result = propertyService.createProperty(newProperty);

        // Then
        assertThat(result).isEqualTo(newProperty);
        verify(propertyRepository).save(newProperty);
    }

    @Test
    void createProperty_WithInvalidData_ShouldThrowException() {
        // Given
        Property invalidProperty = Property.builder()
            .address("")  // Invalid: empty address
            .price(0.0)   // Invalid: price <= 0
            .bedrooms(0)  // Invalid: bedrooms <= 0
            .bathrooms(0) // Invalid: bathrooms <= 0
            .squareFootage(0.0) // Invalid: squareFootage <= 0
            .build();

        // When/Then
        assertThatThrownBy(() -> propertyService.createProperty(invalidProperty))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("Address is required");
    }

    @Test
    void createProperty_WithNegativePrice_ShouldThrowException() {
        // Given
        Property invalidProperty = Property.builder()
            .address("123 Test St")
            .description("Test Description")
            .price(-500000.0)  // Invalid: negative price
            .bedrooms(3)
            .bathrooms(2)
            .squareFootage(2000.0)
            .build();

        // When/Then
        assertThatThrownBy(() -> propertyService.createProperty(invalidProperty))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("Price must be greater than 0");
    }

    @Test
    void createProperty_WithZeroBedrooms_ShouldThrowException() {
        // Given
        Property invalidProperty = Property.builder()
            .address("123 Test St")
            .description("Test Description")
            .price(500000.0)
            .bedrooms(0)  // Invalid: zero bedrooms
            .bathrooms(2)
            .squareFootage(2000.0)
            .build();

        // When/Then
        assertThatThrownBy(() -> propertyService.createProperty(invalidProperty))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("Number of bedrooms must be greater than 0");
    }

    @Test
    void createProperty_WithZeroBathrooms_ShouldThrowException() {
        // Given
        Property invalidProperty = Property.builder()
            .address("123 Test St")
            .description("Test Description")
            .price(500000.0)
            .bedrooms(3)
            .bathrooms(0)  // Invalid: zero bathrooms
            .squareFootage(2000.0)
            .build();

        // When/Then
        assertThatThrownBy(() -> propertyService.createProperty(invalidProperty))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("Number of bathrooms must be greater than 0");
    }

    @Test
    void createProperty_WithZeroSquareFootage_ShouldThrowException() {
        // Given
        Property invalidProperty = Property.builder()
            .address("123 Test St")
            .description("Test Description")
            .price(500000.0)
            .bedrooms(3)
            .bathrooms(2)
            .squareFootage(0.0)  // Invalid: zero square footage
            .build();

        // When/Then
        assertThatThrownBy(() -> propertyService.createProperty(invalidProperty))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("Square footage must be greater than 0");
    }

    @Test
    void createProperty_WithNullAddress_ShouldThrowException() {
        // Given
        Property invalidProperty = Property.builder()
            .address(null)  // Invalid: null address
            .description("Test Description")
            .price(500000.0)
            .bedrooms(3)
            .bathrooms(2)
            .squareFootage(2000.0)
            .build();

        // When/Then
        assertThatThrownBy(() -> propertyService.createProperty(invalidProperty))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("Address is required");
    }

    @Test
    void createProperty_WithBlankAddress_ShouldThrowException() {
        // Given
        Property invalidProperty = Property.builder()
            .address("   ")  // Invalid: blank address
            .description("Test Description")
            .price(500000.0)
            .bedrooms(3)
            .bathrooms(2)
            .squareFootage(2000.0)
            .build();

        // When/Then
        assertThatThrownBy(() -> propertyService.createProperty(invalidProperty))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("Address is required");
    }

    @Test
    void updateProperty_WhenPropertyExists_ShouldUpdateProperty() {
        // Given
        Property updatedProperty = Property.builder()
            .address("Updated Address")
            .description("Updated Description")
            .price(600000.0)
            .bedrooms(4)
            .bathrooms(3)
            .squareFootage(2500.0)
            .build();

        when(propertyRepository.findById(1L)).thenReturn(Optional.of(testProperty));
        when(propertyRepository.save(any(Property.class))).thenReturn(updatedProperty);

        // When
        Property result = propertyService.updateProperty(1L, updatedProperty);

        // Then
        assertThat(result).isEqualTo(updatedProperty);
        verify(propertyRepository).findById(1L);
        verify(propertyRepository).save(any(Property.class));
    }

    @Test
    void updateProperty_WhenPropertyDoesNotExist_ShouldThrowException() {
        // Given
        when(propertyRepository.findById(1L)).thenReturn(Optional.empty());

        // When/Then
        assertThatThrownBy(() -> propertyService.updateProperty(1L, testProperty))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessageContaining("Property")
            .hasMessageContaining("id")
            .hasMessageContaining("1");
    }

    @Test
    void deleteProperty_WhenPropertyExists_ShouldDeleteProperty() {
        // Given
        when(propertyRepository.existsById(1L)).thenReturn(true);

        // When
        propertyService.deleteProperty(1L);

        // Then
        verify(propertyRepository).existsById(1L);
        verify(propertyRepository).deleteById(1L);
    }

    @Test
    void deleteProperty_WhenPropertyDoesNotExist_ShouldThrowException() {
        // Given
        when(propertyRepository.existsById(1L)).thenReturn(false);

        // When/Then
        assertThatThrownBy(() -> propertyService.deleteProperty(1L))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessageContaining("Property")
            .hasMessageContaining("id")
            .hasMessageContaining("1");
    }

    @Test
    void searchProperties_WithValidParameters_ShouldReturnFilteredProperties() {
        // Given
        String address = "Test";
        Double minPrice = 400000.0;
        Double maxPrice = 600000.0;
        Integer bedrooms = 3;
        Pageable pageable = PageRequest.of(0, 12);

        when(propertyRepository.findAll(any(Specification.class), any(Pageable.class)))
            .thenReturn(testPage);

        // When
        Page<Property> result = propertyService.searchProperties(address, minPrice, maxPrice, bedrooms, pageable);

        // Then
        assertThat(result).isEqualTo(testPage);
        verify(propertyRepository).findAll(any(Specification.class), any(Pageable.class));
    }

    @Test
    void searchProperties_WithInvalidParameters_ShouldThrowException() {
        // Given
        Double minPrice = -1000.0;  // Invalid: negative price
        Double maxPrice = 500.0;    // Invalid: less than minPrice
        Integer bedrooms = -1;      // Invalid: negative bedrooms
        Pageable pageable = PageRequest.of(0, 12);

        // When/Then
        assertThatThrownBy(() -> propertyService.searchProperties(null, minPrice, maxPrice, bedrooms, pageable))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("Minimum price cannot be negative");
    }

    @Test
    void searchProperties_WithNoFilters_ShouldReturnAllProperties() {
        // Given
        Pageable pageable = PageRequest.of(0, 12);

        when(propertyRepository.findAll(any(Specification.class), any(Pageable.class)))
            .thenReturn(testPage);

        // When
        Page<Property> result = propertyService.searchProperties(null, null, null, null, pageable);

        // Then
        assertThat(result).isEqualTo(testPage);
        verify(propertyRepository).findAll(any(Specification.class), any(Pageable.class));
    }

    @Test
    void searchProperties_WithInvalidPriceRange_ShouldThrowException() {
        // Given
        Double minPrice = 600000.0;
        Double maxPrice = 500000.0;  // Invalid: maxPrice < minPrice
        Pageable pageable = PageRequest.of(0, 12);

        // When/Then
        assertThatThrownBy(() -> propertyService.searchProperties(null, minPrice, maxPrice, null, pageable))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("Maximum price must be greater than minimum price");
    }

    @Test
    void searchProperties_WithNegativeBedrooms_ShouldThrowException() {
        // Given
        Integer bedrooms = -2;  // Invalid: negative bedrooms
        Pageable pageable = PageRequest.of(0, 12);

        // When/Then
        assertThatThrownBy(() -> propertyService.searchProperties(null, null, null, bedrooms, pageable))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("Number of bedrooms cannot be negative");
    }
} 