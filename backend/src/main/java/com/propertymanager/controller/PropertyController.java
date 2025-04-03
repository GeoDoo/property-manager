package com.propertymanager.controller;

import com.propertymanager.model.Property;
import com.propertymanager.service.PropertyService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/properties")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@Validated
public class PropertyController {

    private final PropertyService propertyService;

    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @GetMapping
    public Page<Property> getAllProperties(@PageableDefault(size = 12) Pageable pageable) {
        return propertyService.searchProperties(null, null, null, null, pageable);
    }

    @GetMapping("/{id}")
    public Property getPropertyById(@PathVariable Long id) {
        return propertyService.getPropertyById(id);
    }

    @PostMapping
    public Property createProperty(@Valid @RequestBody Property property) {
        return propertyService.createProperty(property);
    }

    @PutMapping("/{id}")
    public Property updateProperty(@PathVariable Long id, @Valid @RequestBody Property property) {
        return propertyService.updateProperty(id, property);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(@PathVariable Long id) {
        propertyService.deleteProperty(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchProperties(
            @RequestParam(required = false) 
            @Pattern(regexp = "^[a-zA-Z0-9\\s,.-]*$", message = "Address can only contain letters, numbers, spaces, commas, periods, and hyphens")
            String address,
            
            @RequestParam(required = false) 
            @PositiveOrZero(message = "Minimum price must be a positive number")
            Double minPrice,
            
            @RequestParam(required = false) 
            @PositiveOrZero(message = "Maximum price must be a positive number")
            Double maxPrice,
            
            @RequestParam(required = false) 
            @PositiveOrZero(message = "Number of bedrooms must be a positive number")
            Integer bedrooms,
            
            @PageableDefault(size = 12) Pageable pageable) {
        try {
            Page<Property> properties = propertyService.searchProperties(address, minPrice, maxPrice, bedrooms, pageable);
            return ResponseEntity.ok(properties);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
} 