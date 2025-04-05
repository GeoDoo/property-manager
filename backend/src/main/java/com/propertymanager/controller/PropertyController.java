package com.propertymanager.controller;

import com.propertymanager.model.Property;
import com.propertymanager.service.PropertyService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/properties")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@Validated
public class PropertyController {

    private final PropertyService propertyService;

    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Page<Property>> getAllProperties(
            @RequestParam(required = false) String address,
            @RequestParam(required = false) String minPrice,
            @RequestParam(required = false) String maxPrice,
            @RequestParam(required = false) String minSize,
            @RequestParam(required = false) String maxSize,
            @RequestParam(required = false) String bedrooms,
            @RequestParam(required = false) String maxRooms,
            @RequestParam(required = false) String minBathrooms,
            @RequestParam(required = false) String maxBathrooms,
            @PageableDefault(size = 12) Pageable pageable) {
        
        // Convert string parameters to appropriate types
        Double minPriceValue = parseDouble(minPrice);
        Double maxPriceValue = parseDouble(maxPrice);
        Double minSizeValue = parseDouble(minSize);
        Double maxSizeValue = parseDouble(maxSize);
        Integer bedroomsValue = parseInteger(bedrooms);
        Integer maxRoomsValue = parseInteger(maxRooms);
        Integer minBathroomsValue = parseInteger(minBathrooms);
        Integer maxBathroomsValue = parseInteger(maxBathrooms);
        
        // Validate price range
        if (minPriceValue != null && maxPriceValue != null && minPriceValue > maxPriceValue) {
            throw new IllegalArgumentException("Maximum price must be greater than or equal to minimum price");
        }
        
        // Log the received parameters for debugging
        System.out.println("Received parameters: address=" + address + 
                         ", minPrice=" + minPrice + "(" + minPriceValue + ")" +
                         ", maxPrice=" + maxPrice + "(" + maxPriceValue + ")" +
                         ", bedrooms=" + bedrooms + "(" + bedroomsValue + ")");
        
        Page<Property> properties = propertyService.searchProperties(
            address, minPriceValue, maxPriceValue, minSizeValue, maxSizeValue,
            bedroomsValue, maxRoomsValue, minBathroomsValue, maxBathroomsValue,
            pageable);
        return ResponseEntity.ok(properties);
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Property> getPropertyById(@PathVariable Long id) {
        Property property = propertyService.getPropertyById(id);
        return ResponseEntity.ok(property);
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Property> createProperty(@Valid @RequestBody Property property) {
        Property savedProperty = propertyService.createProperty(property);
        return ResponseEntity.ok(savedProperty);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Property> updateProperty(@PathVariable Long id, @Valid @RequestBody Property property) {
        Property updatedProperty = propertyService.updateProperty(id, property);
        return ResponseEntity.ok(updatedProperty);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProperty(@PathVariable Long id) {
        propertyService.deleteProperty(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping(value = "/search", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Page<Property>> searchProperties(
            @RequestParam(required = false) String address,
            @RequestParam(required = false) String minPrice,
            @RequestParam(required = false) String maxPrice,
            @RequestParam(required = false) String minSize,
            @RequestParam(required = false) String maxSize,
            @RequestParam(required = false) String bedrooms,
            @RequestParam(required = false) String maxRooms,
            @RequestParam(required = false) String minBathrooms,
            @RequestParam(required = false) String maxBathrooms,
            @PageableDefault(size = 12) Pageable pageable) {
        
        // Convert string parameters to appropriate types
        Double minPriceValue = parseDouble(minPrice);
        Double maxPriceValue = parseDouble(maxPrice);
        Double minSizeValue = parseDouble(minSize);
        Double maxSizeValue = parseDouble(maxSize);
        Integer bedroomsValue = parseInteger(bedrooms);
        Integer maxRoomsValue = parseInteger(maxRooms);
        Integer minBathroomsValue = parseInteger(minBathrooms);
        Integer maxBathroomsValue = parseInteger(maxBathrooms);
        
        // Validate price range
        if (minPriceValue != null && maxPriceValue != null && minPriceValue > maxPriceValue) {
            throw new IllegalArgumentException("Maximum price must be greater than or equal to minimum price");
        }
        
        Page<Property> results = propertyService.searchProperties(
            address, minPriceValue, maxPriceValue, minSizeValue, maxSizeValue,
            bedroomsValue, maxRoomsValue, minBathroomsValue, maxBathroomsValue,
            pageable);
        
        return ResponseEntity.ok(results);
    }
    
    private Double parseDouble(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return Double.parseDouble(value);
        } catch (NumberFormatException e) {
            return null; // Just ignore invalid number formats
        }
    }
    
    private Integer parseInteger(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException e) {
            return null; // Just ignore invalid number formats
        }
    }
} 