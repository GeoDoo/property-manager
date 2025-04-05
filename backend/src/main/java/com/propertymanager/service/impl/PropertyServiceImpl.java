package com.propertymanager.service.impl;

import com.propertymanager.exception.ResourceNotFoundException;
import com.propertymanager.model.Property;
import com.propertymanager.repository.PropertyRepository;
import com.propertymanager.service.PropertyService;
import jakarta.persistence.criteria.Predicate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional(readOnly = true)
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
    @Transactional
    public Property createProperty(Property property) {
        logger.debug("Creating new property: {}", property);
        validateProperty(property);
        return propertyRepository.save(property);
    }

    @Override
    @Transactional
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
    @Transactional
    public void deleteProperty(Long id) {
        logger.debug("Deleting property with id: {}", id);
        if (!propertyRepository.existsById(id)) {
            throw new ResourceNotFoundException("Property", "id", id);
        }
        propertyRepository.deleteById(id);
    }

    @Override
    public Page<Property> searchProperties(
            String address,
            Double minPrice,
            Double maxPrice,
            Double minSize,
            Double maxSize,
            Integer bedrooms,
            Integer maxRooms,
            Integer minBathrooms,
            Integer maxBathrooms,
            Pageable pageable) {
        logger.debug("Searching properties with criteria: address={}, price={}-{}, size={}-{}, bedrooms={}, maxRooms={}, bathrooms={}-{}", 
            address, minPrice, maxPrice, minSize, maxSize, bedrooms, maxRooms, minBathrooms, maxBathrooms);
        
        validateSearchParameters(minPrice, maxPrice, bedrooms);

        Specification<Property> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            if (address != null && !address.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("address")), "%" + address.toLowerCase() + "%"));
            }
            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            }
            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            }
            if (minSize != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("squareFootage"), minSize));
            }
            if (maxSize != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("squareFootage"), maxSize));
            }
            if (bedrooms != null) {
                predicates.add(cb.equal(root.get("bedrooms"), bedrooms));
            }
            if (maxRooms != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("bedrooms"), maxRooms));
            }
            if (minBathrooms != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("bathrooms"), minBathrooms));
            }
            if (maxBathrooms != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("bathrooms"), maxBathrooms));
            }
            
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        
        return propertyRepository.findAll(spec, pageable);
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

    private void validateSearchParameters(Double minPrice, Double maxPrice, Integer bedrooms) {
        if (minPrice != null && minPrice < 0) {
            throw new IllegalArgumentException("Minimum price cannot be negative");
        }
        if (maxPrice != null && maxPrice < 0) {
            throw new IllegalArgumentException("Maximum price cannot be negative");
        }
        if (minPrice != null && maxPrice != null && maxPrice < minPrice) {
            throw new IllegalArgumentException("Maximum price must be greater than or equal to minimum price");
        }
        if (bedrooms != null && bedrooms < 0) {
            throw new IllegalArgumentException("Number of bedrooms cannot be negative");
        }
    }
} 