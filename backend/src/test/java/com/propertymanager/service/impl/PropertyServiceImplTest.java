package com.propertymanager.service.impl;

import com.propertymanager.exception.ResourceNotFoundException;
import com.propertymanager.model.Property;
import com.propertymanager.repository.PropertyRepository;
import com.propertymanager.service.PropertyServiceImpl;
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
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PropertyServiceImplTest {

    @Mock
    private PropertyRepository propertyRepository;

    @InjectMocks
    private PropertyServiceImpl propertyService;

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
    void getAllProperties_ShouldReturnAllProperties() {
        // Arrange
        when(propertyRepository.findAll()).thenReturn(testProperties);

        // Act
        List<Property> result = propertyService.getAllProperties();

        // Assert
        assertThat(result).hasSize(2)
                .containsExactlyElementsOf(testProperties);
        verify(propertyRepository).findAll();
    }

    @Test
    void getPropertyById_WhenPropertyExists_ShouldReturnProperty() {
        // Arrange
        when(propertyRepository.findById(1L)).thenReturn(Optional.of(testProperty));

        // Act
        Property result = propertyService.getPropertyById(1L);

        // Assert
        assertThat(result).isEqualTo(testProperty);
        verify(propertyRepository).findById(1L);
    }

    @Test
    void getPropertyById_WhenPropertyDoesNotExist_ShouldThrowException() {
        // Arrange
        when(propertyRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> propertyService.getPropertyById(1L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Property not found with id: 1");
        verify(propertyRepository).findById(1L);
    }

    @Test
    void createProperty_WithValidData_ShouldCreateProperty() {
        // Arrange
        when(propertyRepository.save(any(Property.class))).thenReturn(testProperty);

        // Act
        Property result = propertyService.createProperty(testProperty);

        // Assert
        assertThat(result).isEqualTo(testProperty);
        verify(propertyRepository).save(testProperty);
    }

    @Test
    void createProperty_WithInvalidData_ShouldThrowException() {
        // Arrange
        Property invalidProperty = Property.builder()
                .address("")  // Invalid empty address
                .build();

        // Act & Assert
        assertThatThrownBy(() -> propertyService.createProperty(invalidProperty))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Address is required");
        verify(propertyRepository, never()).save(any(Property.class));
    }

    @Test
    void updateProperty_WhenPropertyExists_ShouldUpdateProperty() {
        // Arrange
        Property updatedProperty = Property.builder()
                .address("Updated Address")
                .description("Updated Description")
                .price(250000.0)
                .bedrooms(4)
                .bathrooms(3)
                .squareFootage(1800.0)
                .build();

        when(propertyRepository.findById(1L)).thenReturn(Optional.of(testProperty));
        when(propertyRepository.save(any(Property.class))).thenReturn(updatedProperty);

        // Act
        Property result = propertyService.updateProperty(1L, updatedProperty);

        // Assert
        assertThat(result).isEqualTo(updatedProperty);
        verify(propertyRepository).findById(1L);
        verify(propertyRepository).save(any(Property.class));
    }

    @Test
    void updateProperty_WhenPropertyDoesNotExist_ShouldThrowException() {
        // Arrange
        when(propertyRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> propertyService.updateProperty(1L, testProperty))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Property not found with id: 1");
        verify(propertyRepository, never()).save(any(Property.class));
    }

    @Test
    void deleteProperty_WhenPropertyExists_ShouldDeleteProperty() {
        // Arrange
        when(propertyRepository.existsById(1L)).thenReturn(true);

        // Act
        propertyService.deleteProperty(1L);

        // Assert
        verify(propertyRepository).existsById(1L);
        verify(propertyRepository).deleteById(1L);
    }

    @Test
    void deleteProperty_WhenPropertyDoesNotExist_ShouldThrowException() {
        // Arrange
        when(propertyRepository.existsById(1L)).thenReturn(false);

        // Act & Assert
        assertThatThrownBy(() -> propertyService.deleteProperty(1L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Property not found with id: 1");
        verify(propertyRepository, never()).deleteById(any());
    }

    @Test
    void searchProperties_WithValidParameters_ShouldReturnFilteredProperties() {
        // Arrange
        Page<Property> pagedResponse = new PageImpl<>(testProperties);
        when(propertyRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(pagedResponse);

        // Act
        Page<Property> result = propertyService.searchProperties(
                "Test",          // address
                100000.0,        // minPrice
                300000.0,        // maxPrice
                1500.0,          // minSize
                2500.0,          // maxSize
                3,              // minRooms
                5,              // maxRooms
                2,              // minBathrooms
                3,              // maxBathrooms
                2000,           // minYearBuilt
                2023,           // maxYearBuilt
                1000.0,         // minLotSize
                2000.0,         // maxLotSize
                PageRequest.of(0, 12));

        // Assert
        assertThat(result.getContent()).hasSize(2)
                .containsExactlyElementsOf(testProperties);
        verify(propertyRepository).findAll(any(Specification.class), any(Pageable.class));
    }

    @Test
    void searchProperties_WithInvalidPriceRange_ShouldThrowException() {
        // Act & Assert
        assertThatThrownBy(() -> propertyService.searchProperties(
                null,           // address
                300000.0,       // minPrice
                200000.0,       // maxPrice
                null,           // minSize
                null,           // maxSize
                null,           // minRooms
                null,           // maxRooms
                null,           // minBathrooms
                null,           // maxBathrooms
                null,           // minYearBuilt
                null,           // maxYearBuilt
                null,           // minLotSize
                null,           // maxLotSize
                PageRequest.of(0, 12)))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Maximum price must be greater than or equal to minimum price");
        verify(propertyRepository, never()).findAll(any(Specification.class), any(Pageable.class));
    }

    @Test
    void searchProperties_WithNegativePrice_ShouldThrowException() {
        // Act & Assert
        assertThatThrownBy(() -> propertyService.searchProperties(
                null,           // address
                -1000.0,        // minPrice
                null,           // maxPrice
                null,           // minSize
                null,           // maxSize
                null,           // minRooms
                null,           // maxRooms
                null,           // minBathrooms
                null,           // maxBathrooms
                null,           // minYearBuilt
                null,           // maxYearBuilt
                null,           // minLotSize
                null,           // maxLotSize
                PageRequest.of(0, 12)))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Minimum price cannot be negative");
        verify(propertyRepository, never()).findAll(any(Specification.class), any(Pageable.class));
    }

    @Test
    void searchProperties_WithNegativeBedrooms_ShouldThrowException() {
        // Act & Assert
        assertThatThrownBy(() -> propertyService.searchProperties(
                null,           // address
                null,           // minPrice
                null,           // maxPrice
                null,           // minSize
                null,           // maxSize
                -1,            // minRooms
                null,           // maxRooms
                null,           // minBathrooms
                null,           // maxBathrooms
                null,           // minYearBuilt
                null,           // maxYearBuilt
                null,           // minLotSize
                null,           // maxLotSize
                PageRequest.of(0, 12)))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Number of bedrooms cannot be negative");
        verify(propertyRepository, never()).findAll(any(Specification.class), any(Pageable.class));
    }

    @Test
    void searchProperties_WithNoParameters_ShouldReturnAllProperties() {
        // Arrange
        Page<Property> pagedResponse = new PageImpl<>(testProperties);
        when(propertyRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(pagedResponse);

        // Act
        Page<Property> result = propertyService.searchProperties(
                null,           // address
                null,           // minPrice
                null,           // maxPrice
                null,           // minSize
                null,           // maxSize
                null,           // minRooms
                null,           // maxRooms
                null,           // minBathrooms
                null,           // maxBathrooms
                null,           // minYearBuilt
                null,           // maxYearBuilt
                null,           // minLotSize
                null,           // maxLotSize
                PageRequest.of(0, 12));

        // Assert
        assertThat(result.getContent()).hasSize(2)
                .containsExactlyElementsOf(testProperties);
        verify(propertyRepository).findAll(any(Specification.class), any(Pageable.class));
    }
} 