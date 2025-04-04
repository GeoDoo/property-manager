package com.propertymanager.service.impl;

import com.propertymanager.exception.ResourceNotFoundException;
import com.propertymanager.model.Property;
import com.propertymanager.repository.PropertyRepository;
import com.propertymanager.service.PropertyService;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PropertyServiceImpl implements PropertyService {
    private final PropertyRepository propertyRepository;

    public PropertyServiceImpl(PropertyRepository propertyRepository) {
        this.propertyRepository = propertyRepository;
    }

    @Override
    public List<Property> getAllProperties() {
        return propertyRepository.findAll();
    }

    @Override
    public Property getPropertyById(Long id) {
        return propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", id));
    }

    @Override
    public Property createProperty(Property property) {
        return propertyRepository.save(property);
    }

    @Override
    public Property updateProperty(Long id, Property property) {
        Property existingProperty = getPropertyById(id);
        existingProperty.setAddress(property.getAddress());
        existingProperty.setDescription(property.getDescription());
        existingProperty.setPrice(property.getPrice());
        existingProperty.setBedrooms(property.getBedrooms());
        existingProperty.setBathrooms(property.getBathrooms());
        existingProperty.setSquareFootage(property.getSquareFootage());
        existingProperty.setRooms(property.getRooms());
        existingProperty.setYearBuilt(property.getYearBuilt());
        existingProperty.setLotSize(property.getLotSize());
        return propertyRepository.save(existingProperty);
    }

    @Override
    public void deleteProperty(Long id) {
        Property property = getPropertyById(id);
        propertyRepository.delete(property);
    }

    @Override
    public Page<Property> searchProperties(
            String address,
            Double minPrice,
            Double maxPrice,
            Double minSize,
            Double maxSize,
            Integer minRooms,
            Integer maxRooms,
            Integer minBathrooms,
            Integer maxBathrooms,
            Integer minYearBuilt,
            Integer maxYearBuilt,
            Double minLotSize,
            Double maxLotSize,
            Pageable pageable) {
        
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
            if (minRooms != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("rooms"), minRooms));
            }
            if (maxRooms != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("rooms"), maxRooms));
            }
            if (minBathrooms != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("bathrooms"), minBathrooms));
            }
            if (maxBathrooms != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("bathrooms"), maxBathrooms));
            }
            if (minYearBuilt != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("yearBuilt"), minYearBuilt));
            }
            if (maxYearBuilt != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("yearBuilt"), maxYearBuilt));
            }
            if (minLotSize != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("lotSize"), minLotSize));
            }
            if (maxLotSize != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("lotSize"), maxLotSize));
            }
            
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        
        return propertyRepository.findAll(spec, pageable);
    }
} 