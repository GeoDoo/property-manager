package com.propertymanager.repository;

import com.propertymanager.entity.Property;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
class PropertyRepositoryTest {

    @Autowired
    private PropertyRepository propertyRepository;

    private Property createTestProperty() {
        Property property = new Property();
        property.setAddress("123 Test St");
        property.setPrice(new BigDecimal("250000.00"));
        property.setBedrooms(3);
        property.setBathrooms(2);
        property.setSquareFootage(2000.0);
        return property;
    }

    @Test
    void findById_ShouldReturnProperty() {
        // Arrange
        Property savedProperty = propertyRepository.save(createTestProperty());

        // Act
        Optional<Property> found = propertyRepository.findById(savedProperty.getId());

        // Assert
        assertTrue(found.isPresent());
        assertEquals(savedProperty.getAddress(), found.get().getAddress());
    }

    @Test
    void findAll_ShouldReturnAllProperties() {
        // Arrange
        propertyRepository.save(createTestProperty());
        propertyRepository.save(createTestProperty());

        // Act
        List<Property> properties = propertyRepository.findAll();

        // Assert
        assertEquals(2, properties.size());
    }

    @Test
    void save_ShouldPersistProperty() {
        // Arrange
        Property property = createTestProperty();

        // Act
        Property savedProperty = propertyRepository.save(property);

        // Assert
        assertNotNull(savedProperty.getId());
        assertEquals(property.getAddress(), savedProperty.getAddress());
    }

    @Test
    void delete_ShouldRemoveProperty() {
        // Arrange
        Property savedProperty = propertyRepository.save(createTestProperty());

        // Act
        propertyRepository.delete(savedProperty);
        Optional<Property> found = propertyRepository.findById(savedProperty.getId());

        // Assert
        assertFalse(found.isPresent());
    }
} 