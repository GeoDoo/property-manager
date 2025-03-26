package com.propertymanager.controller;

import com.propertymanager.model.Property;
import com.propertymanager.repository.PropertyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    @Autowired
    private PropertyRepository propertyRepository;

    @GetMapping
    public List<Property> getAllProperties() {
        return propertyRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Property> getPropertyById(@PathVariable Long id) {
        return propertyRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Property createProperty(@RequestBody Property property) {
        return propertyRepository.save(property);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Property> updateProperty(@PathVariable Long id, @RequestBody Property property) {
        return propertyRepository.findById(id)
                .map(existingProperty -> {
                    property.setId(id);
                    Property updatedProperty = propertyRepository.save(property);
                    return ResponseEntity.ok(updatedProperty);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(@PathVariable Long id) {
        return propertyRepository.findById(id)
                .map(property -> {
                    propertyRepository.delete(property);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public List<Property> searchProperties(@RequestParam String streetName) {
        return propertyRepository.findByAddressContainingIgnoreCase(streetName);
    }
} 