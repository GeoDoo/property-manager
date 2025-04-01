package com.propertymanager.service;

import com.propertymanager.model.Property;
import java.util.List;

public interface PropertyService {
    List<Property> searchProperties(String streetName);
    List<Property> getAllProperties();
    Property getPropertyById(Long id);
    Property createProperty(Property property);
    Property updateProperty(Long id, Property property);
    void deleteProperty(Long id);
} 