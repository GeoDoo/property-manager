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

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Page<Property>> getAllProperties(@PageableDefault(size = 12) Pageable pageable) {
        Page<Property> properties = propertyService.searchProperties(
            null, null, null, null, null,
            null, null, null, null,
            pageable);
        return ResponseEntity.ok(properties);
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Property> getPropertyById(@PathVariable Long id) {
        Property property = propertyService.getPropertyById(id);
        return ResponseEntity.ok(property);
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Property> createProperty(@Valid @RequestBody Property property) {
        Property savedProperty = propertyService.createProperty(property);
        return ResponseEntity.ok(savedProperty);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Property> updateProperty(@PathVariable Long id, @Valid @RequestBody Property property) {
        Property updatedProperty = propertyService.updateProperty(id, property);
        return ResponseEntity.ok(updatedProperty);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(@PathVariable Long id) {
        propertyService.deleteProperty(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping(value = "/search", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Page<Property>> searchProperties(
            @RequestParam(required = false) @Pattern(regexp = "^[a-zA-Z0-9\\s\\-\\.,#/'()&]*$", message = "Invalid address pattern") String address,
            @RequestParam(required = false) @PositiveOrZero(message = "Minimum price must be non-negative") Double minPrice,
            @RequestParam(required = false) @PositiveOrZero(message = "Maximum price must be non-negative") Double maxPrice,
            @RequestParam(required = false) @PositiveOrZero(message = "Minimum size must be non-negative") Double minSize,
            @RequestParam(required = false) @PositiveOrZero(message = "Maximum size must be non-negative") Double maxSize,
            @RequestParam(required = false) @PositiveOrZero(message = "Minimum rooms must be non-negative") Integer minRooms,
            @RequestParam(required = false) @PositiveOrZero(message = "Maximum rooms must be non-negative") Integer maxRooms,
            @RequestParam(required = false) @PositiveOrZero(message = "Minimum bathrooms must be non-negative") Integer minBathrooms,
            @RequestParam(required = false) @PositiveOrZero(message = "Maximum bathrooms must be non-negative") Integer maxBathrooms,
            @PageableDefault(size = 12) Pageable pageable) {
        // Validate price range
        if (minPrice != null && maxPrice != null && minPrice > maxPrice) {
            throw new IllegalArgumentException("Maximum price must be greater than or equal to minimum price");
        }
        Page<Property> results = propertyService.searchProperties(
            address, minPrice, maxPrice, minSize, maxSize,
            minRooms, maxRooms, minBathrooms, maxBathrooms,
            pageable);
        
        return ResponseEntity.ok(results);
    }

    @PostMapping(path = "/search", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Page<Property>> searchPropertiesPost(@RequestBody(required = false) Map<String, Object> searchCriteria, 
                                                @PageableDefault(size = 12) Pageable pageable) {
        // Extract parameters from searchCriteria if present
        String address = searchCriteria != null ? (String) searchCriteria.get("address") : null;
        Double minPrice = searchCriteria != null ? parseDouble(searchCriteria.get("minPrice")) : null;
        Double maxPrice = searchCriteria != null ? parseDouble(searchCriteria.get("maxPrice")) : null;
        Double minSize = searchCriteria != null ? parseDouble(searchCriteria.get("minSize")) : null;
        Double maxSize = searchCriteria != null ? parseDouble(searchCriteria.get("maxSize")) : null;
        Integer minRooms = searchCriteria != null ? parseInteger(searchCriteria.get("minRooms")) : null;
        Integer maxRooms = searchCriteria != null ? parseInteger(searchCriteria.get("maxRooms")) : null;
        Integer minBathrooms = searchCriteria != null ? parseInteger(searchCriteria.get("minBathrooms")) : null;
        Integer maxBathrooms = searchCriteria != null ? parseInteger(searchCriteria.get("maxBathrooms")) : null;
        
        // Validate parameters
        validateParameters(address, minPrice, maxPrice, minRooms);
        
        Page<Property> results = propertyService.searchProperties(
            address, minPrice, maxPrice, minSize, maxSize,
            minRooms, maxRooms, minBathrooms, maxBathrooms,
            pageable);
            
        return ResponseEntity.ok(results);
    }
    
    @PostMapping(path = "/search", consumes = MediaType.APPLICATION_XML_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Page<Property>> searchPropertiesPostXml() {
        // This endpoint only exists to test content type validation
        // In a real application, we would handle XML input here
        return ResponseEntity.badRequest().build();
    }
    
    private Double parseDouble(Object value) {
        if (value == null) return null;
        if (value instanceof Number) {
            return ((Number) value).doubleValue();
        }
        try {
            return Double.parseDouble(value.toString());
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid number format: " + value);
        }
    }
    
    private Integer parseInteger(Object value) {
        if (value == null) return null;
        if (value instanceof Number) {
            return ((Number) value).intValue();
        }
        try {
            return Integer.parseInt(value.toString());
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid number format: " + value);
        }
    }
    
    private void validateParameters(String address, Double minPrice, Double maxPrice, Integer bedrooms) {
        // Validate address pattern if provided
        if (address != null && !address.matches("^[a-zA-Z0-9\\s\\-\\.,#/'()&]*$")) {
            throw new IllegalArgumentException("Invalid address pattern");
        }
        
        // Validate price range
        if (minPrice != null && minPrice < 0) {
            throw new IllegalArgumentException("Minimum price cannot be negative");
        }
        if (maxPrice != null && maxPrice < 0) {
            throw new IllegalArgumentException("Maximum price cannot be negative");
        }
        if (minPrice != null && maxPrice != null && minPrice > maxPrice) {
            throw new IllegalArgumentException("Maximum price must be greater than or equal to minimum price");
        }
        
        // Validate bedrooms
        if (bedrooms != null && bedrooms < 0) {
            throw new IllegalArgumentException("Number of bedrooms cannot be negative");
        }
    }
} 