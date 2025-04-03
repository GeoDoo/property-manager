package com.propertymanager.model;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class PropertyTest {

    private Validator validator;
    private Property validProperty;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();

        validProperty = Property.builder()
            .address("123 Test St")
            .description("Test Description")
            .price(500000.0)
            .bedrooms(3)
            .bathrooms(2)
            .squareFootage(2000.0)
            .build();
    }

    @Test
    void whenAllFieldsAreValid_thenNoViolations() {
        // When
        Set<ConstraintViolation<Property>> violations = validator.validate(validProperty);

        // Then
        assertThat(violations).isEmpty();
    }

    @Test
    void whenAddressIsNull_thenViolation() {
        // Given
        validProperty.setAddress(null);

        // When
        Set<ConstraintViolation<Property>> violations = validator.validate(validProperty);

        // Then
        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage()).isEqualTo("Address is required");
    }

    @Test
    void whenAddressExceeds1000Characters_thenViolation() {
        // Given
        String longAddress = "a".repeat(1001);
        validProperty.setAddress(longAddress);

        // When
        Set<ConstraintViolation<Property>> violations = validator.validate(validProperty);

        // Then
        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage()).isEqualTo("Address must not exceed 1000 characters");
    }

    @Test
    void whenPriceIsNegative_thenViolation() {
        // Given
        validProperty.setPrice(-1.0);

        // When
        Set<ConstraintViolation<Property>> violations = validator.validate(validProperty);

        // Then
        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage()).isEqualTo("Price must be greater than 0");
    }

    @Test
    void whenBedroomsIsZero_thenViolation() {
        // Given
        validProperty.setBedrooms(0);

        // When
        Set<ConstraintViolation<Property>> violations = validator.validate(validProperty);

        // Then
        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage()).isEqualTo("Number of bedrooms must be greater than 0");
    }

    @Test
    void whenBathroomsIsZero_thenViolation() {
        // Given
        validProperty.setBathrooms(0);

        // When
        Set<ConstraintViolation<Property>> violations = validator.validate(validProperty);

        // Then
        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage()).isEqualTo("Number of bathrooms must be greater than 0");
    }

    @Test
    void whenSquareFootageIsZero_thenViolation() {
        // Given
        validProperty.setSquareFootage(0.0);

        // When
        Set<ConstraintViolation<Property>> violations = validator.validate(validProperty);

        // Then
        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage()).isEqualTo("Square footage must be greater than 0");
    }

    @Test
    void whenAddingImage_thenImageIsAddedAndPropertyIsSet() {
        // Given
        Image image = new Image();

        // When
        validProperty.addImage(image);

        // Then
        assertThat(validProperty.getImages()).contains(image);
        assertThat(image.getProperty()).isEqualTo(validProperty);
    }

    @Test
    void whenRemovingImage_thenImageIsRemovedAndPropertyIsUnset() {
        // Given
        Image image = new Image();
        validProperty.addImage(image);

        // When
        validProperty.removeImage(image);

        // Then
        assertThat(validProperty.getImages()).doesNotContain(image);
        assertThat(image.getProperty()).isNull();
    }

    @Test
    void whenComparingProperties_thenOnlyIdIsConsidered() {
        // Given
        Property property1 = Property.builder().id(1L).address("123 Test St").build();
        Property property2 = Property.builder().id(1L).address("456 Test Ave").build();
        Property property3 = Property.builder().id(2L).address("123 Test St").build();

        // Then
        assertThat(property1).isEqualTo(property2); // Same ID
        assertThat(property1).isNotEqualTo(property3); // Different ID
    }

    @Test
    void whenToString_thenImagesAreExcluded() {
        // Given
        Image image = new Image();
        validProperty.addImage(image);

        // When
        String toString = validProperty.toString();

        // Then
        assertThat(toString).doesNotContain("images");
    }
} 