package com.propertymanager.service;

import com.propertymanager.model.Property;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PropertyService {
    List<Property> getAllProperties();
    Property getPropertyById(Long id);
    Property createProperty(Property property);
    Property updateProperty(Long id, Property property);
    void deleteProperty(Long id);
    Page<Property> searchProperties(String address, Double minPrice, Double maxPrice, Integer bedrooms, Pageable pageable);
} 