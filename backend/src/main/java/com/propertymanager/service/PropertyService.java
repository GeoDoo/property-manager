package com.propertymanager.service;

import com.propertymanager.model.Property;
import java.util.List;

public interface PropertyService {
    List<Property> getAllProperties();
    Property getPropertyById(Long id);
    Property createProperty(Property property);
    Property updateProperty(Long id, Property property);
    void deleteProperty(Long id);
    List<Property> searchProperties(String address, Double minPrice, Double maxPrice, Integer bedrooms);
} 