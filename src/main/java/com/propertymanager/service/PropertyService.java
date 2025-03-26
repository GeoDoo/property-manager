package com.propertymanager.service;

import com.propertymanager.model.Property;
import com.propertymanager.repository.PropertyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@Service
public class PropertyService {
    private static final Logger logger = LoggerFactory.getLogger(PropertyService.class);
    
    @Autowired
    private PropertyRepository propertyRepository;

    public List<Property> searchProperties(String streetName) {
        if (streetName == null || streetName.trim().isEmpty()) {
            return propertyRepository.findAll();
        }
        return propertyRepository.findByAddressContainingIgnoreCase(streetName.trim());
    }
} 