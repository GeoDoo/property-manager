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
            @RequestParam(required = false) String address,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Double minSize,
            @RequestParam(required = false) Double maxSize,
            @RequestParam(required = false) Integer minRooms,
            @RequestParam(required = false) Integer maxRooms,
            @RequestParam(required = false) Integer minBathrooms,
            @RequestParam(required = false) Integer maxBathrooms,
            @RequestParam(required = false) Integer minYearBuilt,
            @RequestParam(required = false) Integer maxYearBuilt,
            @RequestParam(required = false) Double minLotSize,
            @RequestParam(required = false) Double maxLotSize,
            Pageable pageable) {
        return propertyService.searchProperties(
            address, minPrice, maxPrice, minSize, maxSize,
            minRooms, maxRooms, minBathrooms, maxBathrooms,
            minYearBuilt, maxYearBuilt, minLotSize, maxLotSize,
            pageable);
    }
} 