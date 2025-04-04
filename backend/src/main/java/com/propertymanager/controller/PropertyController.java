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

    @GetMapping
    public Page<Property> getAllProperties(@PageableDefault(size = 12) Pageable pageable) {
        return propertyService.searchProperties(
            null, null, null, null, null,
            null, null, null, null,
            null, null, null, null,
            pageable);
    }

    @GetMapping("/{id}")
    public Property getPropertyById(@PathVariable Long id) {
        return propertyService.getPropertyById(id);
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public Property createProperty(@Valid @RequestBody Property property) {
        return propertyService.createProperty(property);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Property updateProperty(@PathVariable Long id, @Valid @RequestBody Property property) {
        return propertyService.updateProperty(id, property);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(@PathVariable Long id) {
        propertyService.deleteProperty(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public Page<Property> searchProperties(
            @RequestParam(required = false) @Pattern(regexp = "^[a-zA-Z0-9\\s\\-\\.,#/'()&]*$", message = "Invalid address pattern") String address,
            @RequestParam(required = false) @PositiveOrZero(message = "Minimum price must be non-negative") Double minPrice,
            @RequestParam(required = false) @PositiveOrZero(message = "Maximum price must be non-negative") Double maxPrice,
            @RequestParam(required = false) @PositiveOrZero(message = "Minimum size must be non-negative") Double minSize,
            @RequestParam(required = false) @PositiveOrZero(message = "Maximum size must be non-negative") Double maxSize,
            @RequestParam(required = false) @PositiveOrZero(message = "Minimum rooms must be non-negative") Integer minRooms,
            @RequestParam(required = false) @PositiveOrZero(message = "Maximum rooms must be non-negative") Integer maxRooms,
            @RequestParam(required = false) @PositiveOrZero(message = "Minimum bathrooms must be non-negative") Integer minBathrooms,
            @RequestParam(required = false) @PositiveOrZero(message = "Maximum bathrooms must be non-negative") Integer maxBathrooms,
            @RequestParam(required = false) @PositiveOrZero(message = "Minimum year built must be non-negative") Integer minYearBuilt,
            @RequestParam(required = false) @PositiveOrZero(message = "Maximum year built must be non-negative") Integer maxYearBuilt,
            @RequestParam(required = false) @PositiveOrZero(message = "Minimum lot size must be non-negative") Double minLotSize,
            @RequestParam(required = false) @PositiveOrZero(message = "Maximum lot size must be non-negative") Double maxLotSize,
            Pageable pageable) {
        // Validate price range
        if (minPrice != null && maxPrice != null && minPrice > maxPrice) {
            throw new IllegalArgumentException("Maximum price must be greater than or equal to minimum price");
        }
        return propertyService.searchProperties(
            address, minPrice, maxPrice, minSize, maxSize,
            minRooms, maxRooms, minBathrooms, maxBathrooms,
            minYearBuilt, maxYearBuilt, minLotSize, maxLotSize,
            pageable);
    }
} 