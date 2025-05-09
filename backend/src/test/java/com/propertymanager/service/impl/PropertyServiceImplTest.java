package com.propertymanager.service.impl;

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

import java.util.ArrayList;
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
    void getAllProperties_ShouldReturnAllProperties() {
        // Arrange
        when(propertyRepository.findAll()).thenReturn(testProperties);

        // Act
        List<Property> result = propertyService.getAllProperties();

        // Assert
        assertThat(result).hasSize(2).containsExactlyElementsOf(testProperties);
        verify(propertyRepository).findAll();
    }

    @Test
    void getPropertyById_WithValidId_ShouldReturnProperty() {
        // Arrange
        when(propertyRepository.findById(1L)).thenReturn(Optional.of(testProperty));

        // Act
        Property result = propertyService.getPropertyById(1L);

        // Assert
        assertThat(result).isEqualTo(testProperty);
        verify(propertyRepository).findById(1L);
    }

    @Test
    void getPropertyById_WithInvalidId_ShouldThrowException() {
        // Arrange
        when(propertyRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> propertyService.getPropertyById(1L))
                .isInstanceOf(ResourceNotFoundException.class)
                .satisfies(ex -> {
                    ResourceNotFoundException rnfe = (ResourceNotFoundException) ex;
                    assertThat(rnfe.getResourceName()).isEqualTo("Property");
                    assertThat(rnfe.getFieldName()).isEqualTo("id");
                    assertThat(rnfe.getFieldValue()).isEqualTo(1L);
                });
        verify(propertyRepository).findById(1L);
    }

    @Test
    void createProperty_ShouldSaveAndReturnProperty() {
        // Arrange
        when(propertyRepository.save(any(Property.class))).thenReturn(testProperty);

        // Act
        Property result = propertyService.createProperty(testProperty);

        // Assert
        assertThat(result).isEqualTo(testProperty);
        verify(propertyRepository).save(testProperty);
    }

    @Test
    void updateProperty_WithValidId_ShouldUpdateAndReturnProperty() {
        // Arrange
        when(propertyRepository.findById(1L)).thenReturn(Optional.of(testProperty));
        when(propertyRepository.save(any(Property.class))).thenReturn(testProperty);

        Property updatedProperty = Property.builder()
                .address("Updated Address")
                .description("Updated Description")
                .price(250000.0)
                .bedrooms(4)
                .bathrooms(3)
                .squareFootage(2000.0)
                .build();

        // Act
        Property result = propertyService.updateProperty(1L, updatedProperty);

        // Assert
        assertThat(result).isEqualTo(testProperty);
        verify(propertyRepository).findById(1L);
        verify(propertyRepository).save(any(Property.class));
    }

    @Test
    void updateProperty_WithInvalidId_ShouldThrowException() {
        // Arrange
        when(propertyRepository.findById(1L)).thenReturn(Optional.empty());

        Property updatedProperty = Property.builder()
                .address("Updated Address")
                .description("Updated Description")
                .price(250000.0)
                .bedrooms(4)
                .bathrooms(3)
                .squareFootage(2000.0)
                .build();

        // Act & Assert
        assertThatThrownBy(() -> propertyService.updateProperty(1L, updatedProperty))
                .isInstanceOf(ResourceNotFoundException.class)
                .satisfies(ex -> {
                    ResourceNotFoundException rnfe = (ResourceNotFoundException) ex;
                    assertThat(rnfe.getResourceName()).isEqualTo("Property");
                    assertThat(rnfe.getFieldName()).isEqualTo("id");
                    assertThat(rnfe.getFieldValue()).isEqualTo(1L);
                });
        verify(propertyRepository).findById(1L);
        verify(propertyRepository, never()).save(any(Property.class));
    }

    @Test
    void deleteProperty_WithValidId_ShouldDeleteProperty() {
        // Arrange
        when(propertyRepository.existsById(1L)).thenReturn(true);
        doNothing().when(propertyRepository).deleteById(1L);

        // Act
        propertyService.deleteProperty(1L);

        // Assert
        verify(propertyRepository).existsById(1L);
        verify(propertyRepository).deleteById(1L);
    }

    @Test
    void deleteProperty_WithInvalidId_ShouldThrowException() {
        // Arrange
        when(propertyRepository.existsById(1L)).thenReturn(false);

        // Act & Assert
        assertThatThrownBy(() -> propertyService.deleteProperty(1L))
                .isInstanceOf(ResourceNotFoundException.class)
                .satisfies(ex -> {
                    ResourceNotFoundException rnfe = (ResourceNotFoundException) ex;
                    assertThat(rnfe.getResourceName()).isEqualTo("Property");
                    assertThat(rnfe.getFieldName()).isEqualTo("id");
                    assertThat(rnfe.getFieldValue()).isEqualTo(1L);
                });
        verify(propertyRepository).existsById(1L);
        verify(propertyRepository, never()).deleteById(any());
    }

    @Test
    void searchProperties_WithValidParameters_ShouldReturnFilteredProperties() {
        // Arrange
        Page<Property> pagedResponse = createPage(testProperties);
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
                PageRequest.of(0, 12)))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Maximum price")
                .hasMessageContaining("minimum price");
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
                PageRequest.of(0, 12)))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("price")
                .hasMessageContaining("negative");
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
                PageRequest.of(0, 12)))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("bedrooms")
                .hasMessageContaining("negative");
        verify(propertyRepository, never()).findAll(any(Specification.class), any(Pageable.class));
    }

    @Test
    void searchProperties_WithNoParameters_ShouldReturnAllProperties() {
        // Arrange
        Page<Property> pagedResponse = createPage(testProperties);
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
                PageRequest.of(0, 12));

        // Assert
        assertThat(result.getContent()).hasSize(2)
                .containsExactlyElementsOf(testProperties);
        verify(propertyRepository).findAll(any(Specification.class), any(Pageable.class));
    }
    
    @Test
    void createProperty_WithEmptyAddress_ShouldThrowException() {
        // Arrange
        Property invalidProperty = Property.builder()
                .address("")  // Empty address
                .description("Test Property")
                .price(200000.0)
                .bedrooms(3)
                .bathrooms(2)
                .squareFootage(1500.0)
                .build();
                
        // Act & Assert
        assertThatThrownBy(() -> propertyService.createProperty(invalidProperty))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Address is required");
                
        verify(propertyRepository, never()).save(any(Property.class));
    }
    
    @Test
    void createProperty_WithNullAddress_ShouldThrowException() {
        // Arrange
        Property invalidProperty = Property.builder()
                .address(null)  // Null address
                .description("Test Property")
                .price(200000.0)
                .bedrooms(3)
                .bathrooms(2)
                .squareFootage(1500.0)
                .build();
                
        // Act & Assert
        assertThatThrownBy(() -> propertyService.createProperty(invalidProperty))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Address is required");
                
        verify(propertyRepository, never()).save(any(Property.class));
    }
    
    @Test
    void createProperty_WithZeroPrice_ShouldThrowException() {
        // Arrange
        Property invalidProperty = Property.builder()
                .address("123 Test St")
                .description("Test Property")
                .price(0.0)  // Zero price
                .bedrooms(3)
                .bathrooms(2)
                .squareFootage(1500.0)
                .build();
                
        // Act & Assert
        assertThatThrownBy(() -> propertyService.createProperty(invalidProperty))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Price must be greater than 0");
                
        verify(propertyRepository, never()).save(any(Property.class));
    }
    
    @Test
    void createProperty_WithNegativePrice_ShouldThrowException() {
        // Arrange
        Property invalidProperty = Property.builder()
                .address("123 Test St")
                .description("Test Property")
                .price(-100000.0)  // Negative price
                .bedrooms(3)
                .bathrooms(2)
                .squareFootage(1500.0)
                .build();
                
        // Act & Assert
        assertThatThrownBy(() -> propertyService.createProperty(invalidProperty))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Price must be greater than 0");
                
        verify(propertyRepository, never()).save(any(Property.class));
    }
    
    @Test
    void createProperty_WithZeroBedrooms_ShouldThrowException() {
        // Arrange
        Property invalidProperty = Property.builder()
                .address("123 Test St")
                .description("Test Property")
                .price(200000.0)
                .bedrooms(0)  // Zero bedrooms
                .bathrooms(2)
                .squareFootage(1500.0)
                .build();
                
        // Act & Assert
        assertThatThrownBy(() -> propertyService.createProperty(invalidProperty))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("bedrooms must be greater than 0");
                
        verify(propertyRepository, never()).save(any(Property.class));
    }
    
    @Test
    void createProperty_WithZeroBathrooms_ShouldThrowException() {
        // Arrange
        Property invalidProperty = Property.builder()
                .address("123 Test St")
                .description("Test Property")
                .price(200000.0)
                .bedrooms(3)
                .bathrooms(0)  // Zero bathrooms
                .squareFootage(1500.0)
                .build();
                
        // Act & Assert
        assertThatThrownBy(() -> propertyService.createProperty(invalidProperty))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("bathrooms must be greater than 0");
                
        verify(propertyRepository, never()).save(any(Property.class));
    }
    
    @Test
    void createProperty_WithZeroSquareFootage_ShouldThrowException() {
        // Arrange
        Property invalidProperty = Property.builder()
                .address("123 Test St")
                .description("Test Property")
                .price(200000.0)
                .bedrooms(3)
                .bathrooms(2)
                .squareFootage(0.0)  // Zero square footage
                .build();
                
        // Act & Assert
        assertThatThrownBy(() -> propertyService.createProperty(invalidProperty))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Square footage must be greater than 0");
                
        verify(propertyRepository, never()).save(any(Property.class));
    }
    
    @Test
    void searchProperties_WithOnlyAddressFilter_ShouldReturnFilteredProperties() {
        // Arrange
        Page<Property> pagedResponse = createPage(testProperties);
        when(propertyRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(pagedResponse);

        // Act - test with only address parameter
        Page<Property> result = propertyService.searchProperties(
                "Test St",      // address
                null,           // minPrice
                null,           // maxPrice
                null,           // minSize
                null,           // maxSize
                null,           // minRooms
                null,           // maxRooms
                null,           // minBathrooms
                null,           // maxBathrooms
                PageRequest.of(0, 12));

        // Assert
        assertThat(result.getContent()).hasSize(2)
                .containsExactlyElementsOf(testProperties);
        verify(propertyRepository).findAll(any(Specification.class), any(Pageable.class));
    }
    
    @Test
    void searchProperties_WithSizeRangeFilter_ShouldReturnFilteredProperties() {
        // Arrange
        Page<Property> pagedResponse = createPage(testProperties);
        when(propertyRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(pagedResponse);

        // Act - test with min and max size parameters
        Page<Property> result = propertyService.searchProperties(
                null,           // address
                null,           // minPrice
                null,           // maxPrice
                1000.0,         // minSize
                2500.0,         // maxSize
                null,           // minRooms
                null,           // maxRooms
                null,           // minBathrooms
                null,           // maxBathrooms
                PageRequest.of(0, 12));

        // Assert
        assertThat(result.getContent()).hasSize(2)
                .containsExactlyElementsOf(testProperties);
        verify(propertyRepository).findAll(any(Specification.class), any(Pageable.class));
    }
    
    @Test
    void searchProperties_WithBathroomRangeFilter_ShouldReturnFilteredProperties() {
        // Arrange
        Page<Property> pagedResponse = createPage(testProperties);
        when(propertyRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(pagedResponse);

        // Act - test with min and max bathrooms parameters
        Page<Property> result = propertyService.searchProperties(
                null,           // address
                null,           // minPrice
                null,           // maxPrice
                null,           // minSize
                null,           // maxSize
                null,           // minRooms
                null,           // maxRooms
                1,              // minBathrooms
                3,              // maxBathrooms
                PageRequest.of(0, 12));

        // Assert
        assertThat(result.getContent()).hasSize(2)
                .containsExactlyElementsOf(testProperties);
        verify(propertyRepository).findAll(any(Specification.class), any(Pageable.class));
    }
    
    @Test
    void updateProperty_ShouldCopyAllPropertiesFromUpdatedToExisting() {
        // Arrange
        when(propertyRepository.findById(1L)).thenReturn(Optional.of(testProperty));
        when(propertyRepository.save(any(Property.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Property updatedProperty = Property.builder()
                .address("987 Updated St")
                .description("Updated Description")
                .price(400000.0)
                .bedrooms(5)
                .bathrooms(4)
                .squareFootage(3000.0)
                .build();

        // Act
        Property result = propertyService.updateProperty(1L, updatedProperty);

        // Assert
        assertThat(result.getAddress()).isEqualTo("987 Updated St");
        assertThat(result.getDescription()).isEqualTo("Updated Description");
        assertThat(result.getPrice()).isEqualTo(400000.0);
        assertThat(result.getBedrooms()).isEqualTo(5);
        assertThat(result.getBathrooms()).isEqualTo(4);
        assertThat(result.getSquareFootage()).isEqualTo(3000.0);
        verify(propertyRepository).save(testProperty);
    }
    
    @Test
    void validateProperty_WithNullProperties_ShouldThrowExceptions() {
        // Arrange
        Property invalidProperty = Property.builder()
                .address("123 Test St")
                .description("Test Property")
                .price(null)         // Null price
                .bedrooms(null)      // Null bedrooms
                .bathrooms(null)     // Null bathrooms
                .squareFootage(null) // Null square footage
                .build();
                
        // Act & Assert - test null price
        assertThatThrownBy(() -> propertyService.createProperty(invalidProperty))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Price must be greater than 0");
                
        // Update property to test next null value
        invalidProperty.setPrice(200000.0);
        
        // Test null bedrooms
        assertThatThrownBy(() -> propertyService.createProperty(invalidProperty))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("bedrooms must be greater than 0");
                
        // Update property to test next null value
        invalidProperty.setBedrooms(3);
        
        // Test null bathrooms
        assertThatThrownBy(() -> propertyService.createProperty(invalidProperty))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("bathrooms must be greater than 0");
                
        // Update property to test last null value
        invalidProperty.setBathrooms(2);
        
        // Test null square footage
        assertThatThrownBy(() -> propertyService.createProperty(invalidProperty))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Square footage must be greater than 0");
    }
    
    @Test
    void validateSearchParameters_WithNegativeMaxPrice_ShouldThrowException() {
        // Act & Assert
        assertThatThrownBy(() -> propertyService.searchProperties(
                null,           // address
                null,           // minPrice
                -200000.0,      // maxPrice (negative)
                null,           // minSize
                null,           // maxSize
                null,           // minRooms
                null,           // maxRooms
                null,           // minBathrooms
                null,           // maxBathrooms
                PageRequest.of(0, 12)))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Maximum price cannot be negative");
    }
    
    @Test
    void searchProperties_WithUnsupportedPagination_ShouldHandleGracefully() {
        // Arrange
        Page<Property> pagedResponse = createPage(testProperties);
        when(propertyRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(pagedResponse);

        // Act - test with extreme pagination values
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
                PageRequest.of(100, 1000)); // Unreasonable pagination

        // Assert - should still work without throwing exceptions
        assertThat(result.getContent()).hasSize(2)
                .containsExactlyElementsOf(testProperties);
        verify(propertyRepository).findAll(any(Specification.class), any(Pageable.class));
    }
} 