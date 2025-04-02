package com.propertymanager.service;

import com.propertymanager.exception.ResourceNotFoundException;
import com.propertymanager.model.Property;
import com.propertymanager.repository.PropertyRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

/**
 * Service implementation for managing properties.
 * Handles business logic for property operations.
 */
@Service
@Transactional
public class PropertyServiceImpl implements PropertyService {

    private static final Logger logger = LoggerFactory.getLogger(PropertyServiceImpl.class);
    private final PropertyRepository propertyRepository;

    public PropertyServiceImpl(PropertyRepository propertyRepository) {
        this.propertyRepository = propertyRepository;
    }

    @Override
    public List<Property> getAllProperties() {
        logger.debug("Fetching all properties");
        return propertyRepository.findAll();
    }

    @Override
    public Property getPropertyById(Long id) {
        logger.debug("Fetching property with id: {}", id);
        return propertyRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Property", "id", id));
    }

    @Override
    public Property createProperty(Property property) {
        logger.debug("Creating new property: {}", property);
        validateProperty(property);
        return propertyRepository.save(property);
    }

    @Override
    public Property updateProperty(Long id, Property property) {
        logger.debug("Updating property with id {}: {}", id, property);
        validateProperty(property);
        
        Property existingProperty = propertyRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Property", "id", id));
            
        existingProperty.setAddress(property.getAddress());
        existingProperty.setDescription(property.getDescription());
        existingProperty.setPrice(property.getPrice());
        existingProperty.setBedrooms(property.getBedrooms());
        existingProperty.setBathrooms(property.getBathrooms());
        existingProperty.setSquareFootage(property.getSquareFootage());
        
        return propertyRepository.save(existingProperty);
    }

    @Override
    public void deleteProperty(Long id) {
        logger.debug("Deleting property with id: {}", id);
        if (!propertyRepository.existsById(id)) {
            throw new ResourceNotFoundException("Property", "id", id);
        }
        propertyRepository.deleteById(id);
    }

    /**
     * Validates the property data before saving.
     * Throws IllegalArgumentException if validation fails.
     *
     * @param property the property to validate
     */
    private void validateProperty(Property property) {
        if (!StringUtils.hasText(property.getAddress())) {
            throw new IllegalArgumentException("Address is required");
        }
        if (property.getPrice() == null || property.getPrice() <= 0) {
            throw new IllegalArgumentException("Price must be greater than 0");
        }
        if (property.getBedrooms() == null || property.getBedrooms() <= 0) {
            throw new IllegalArgumentException("Number of bedrooms must be greater than 0");
        }
        if (property.getBathrooms() == null || property.getBathrooms() <= 0) {
            throw new IllegalArgumentException("Number of bathrooms must be greater than 0");
        }
        if (property.getSquareFootage() == null || property.getSquareFootage() <= 0) {
            throw new IllegalArgumentException("Square footage must be greater than 0");
        }
    }
} 