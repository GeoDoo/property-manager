package com.propertymanager.service;

import com.propertymanager.model.Property;
import com.propertymanager.repository.PropertyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
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
            .orElseThrow(() -> new RuntimeException("Property not found with id: " + id));
    }

    @Override
    public Property createProperty(Property property) {
        return propertyRepository.save(property);
    }

    @Override
    public Property updateProperty(Long id, Property property) {
        Property existingProperty = getPropertyById(id);
        existingProperty.setAddress(property.getAddress());
        existingProperty.setCity(property.getCity());
        existingProperty.setState(property.getState());
        existingProperty.setZipCode(property.getZipCode());
        existingProperty.setPrice(property.getPrice());
        existingProperty.setBedrooms(property.getBedrooms());
        return propertyRepository.save(existingProperty);
    }

    @Override
    public void deleteProperty(Long id) {
        propertyRepository.deleteById(id);
    }

    @Override
    public List<Property> searchProperties(String streetName) {
        if (streetName == null || streetName.trim().isEmpty()) {
            return propertyRepository.findAll();
        }
        return propertyRepository.findByAddressContainingIgnoreCase(streetName.trim());
    }
} 