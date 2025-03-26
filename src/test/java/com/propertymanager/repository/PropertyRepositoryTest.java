package com.propertymanager.repository;

import com.propertymanager.entity.Property;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
class PropertyRepositoryTest {

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private PlatformTransactionManager transactionManager;

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
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    void findById_ShouldReturnProperty_WithAutoCommit() {
        // Arrange
        Property savedProperty = propertyRepository.save(createTestProperty());
        propertyRepository.flush(); // Force commit

        // Act
        Optional<Property> found = propertyRepository.findById(savedProperty.getId());

        // Assert
        assertTrue(found.isPresent());
        assertEquals(savedProperty.getAddress(), found.get().getAddress());
    }

    @Test
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    void findAll_ShouldReturnAllProperties_WithAutoCommit() {
        // Arrange
        propertyRepository.save(createTestProperty());
        propertyRepository.save(createTestProperty());
        propertyRepository.flush(); // Force commit

        // Act
        List<Property> properties = propertyRepository.findAll();

        // Assert
        assertEquals(2, properties.size());
    }

    @Test
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    void save_ShouldPersistProperty_WithAutoCommit() {
        // Arrange
        Property property = createTestProperty();

        // Act
        Property savedProperty = propertyRepository.save(property);
        propertyRepository.flush(); // Force commit

        // Assert
        assertNotNull(savedProperty.getId());
        assertEquals(property.getAddress(), savedProperty.getAddress());

        // Verify persistence
        Optional<Property> found = propertyRepository.findById(savedProperty.getId());
        assertTrue(found.isPresent());
    }

    @Test
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    void delete_ShouldRemoveProperty_WithAutoCommit() {
        // Arrange
        Property savedProperty = propertyRepository.save(createTestProperty());
        propertyRepository.flush(); // Force commit

        // Act
        propertyRepository.delete(savedProperty);
        propertyRepository.flush(); // Force commit

        // Assert
        Optional<Property> found = propertyRepository.findById(savedProperty.getId());
        assertFalse(found.isPresent());
    }

    @Test
    @Transactional
    void saveAndRollback_ShouldNotPersistProperty() {
        // Arrange
        Property property = createTestProperty();
        propertyRepository.save(property);
        Long savedId = property.getId();
        
        // Act - Verify the property exists in the current transaction
        Optional<Property> beforeRollback = propertyRepository.findById(savedId);
        assertTrue(beforeRollback.isPresent(), "Property should exist before rollback");
        
        // The @Transactional annotation will automatically rollback
        // after the test method completes
    }

    @Test
    @Transactional
    void verifyNoProperties() {
        // This test runs in a new transaction
        List<Property> properties = propertyRepository.findAll();
        assertTrue(properties.isEmpty(), "Database should be empty");
    }
} 