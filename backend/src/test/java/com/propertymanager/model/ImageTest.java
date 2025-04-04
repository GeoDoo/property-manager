package com.propertymanager.model;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class ImageTest {

    private Validator validator;
    private Image validImage;
    private Property testProperty;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();

        testProperty = Property.builder()
            .id(1L)
            .address("123 Test St")
            .build();

        validImage = new Image();
        validImage.setFileName("test-image.jpg");
        validImage.setContentType("image/jpeg");
        validImage.setUrl("https://example.com/images/test-image.jpg");
        validImage.setProperty(testProperty);
    }

    @Test
    void whenAllFieldsAreValid_thenNoViolations() {
        // When
        Set<ConstraintViolation<Image>> violations = validator.validate(validImage);

        // Then
        assertThat(violations).isEmpty();
    }

    @Test
    void whenFileNameIsNull_thenViolation() {
        // Given
        validImage.setFileName(null);

        // When
        Set<ConstraintViolation<Image>> violations = validator.validate(validImage);

        // Then
        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage()).isEqualTo("File name is required");
    }

    @Test
    void whenFileNameIsBlank_thenViolation() {
        // Given
        validImage.setFileName("   ");

        // When
        Set<ConstraintViolation<Image>> violations = validator.validate(validImage);

        // Then
        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage()).isEqualTo("File name is required");
    }

    @Test
    void whenContentTypeIsNull_thenViolation() {
        // Given
        validImage.setContentType(null);

        // When
        Set<ConstraintViolation<Image>> violations = validator.validate(validImage);

        // Then
        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage()).isEqualTo("Content type is required");
    }

    @Test
    void whenContentTypeIsBlank_thenViolation() {
        // Given
        validImage.setContentType("   ");

        // When
        Set<ConstraintViolation<Image>> violations = validator.validate(validImage);

        // Print all violation messages for debugging
        System.out.println("Validation errors when contentType is blank:");
        violations.forEach(v -> System.out.println(" - " + v.getPropertyPath() + ": " + v.getMessage()));
        
        // Then
        assertThat(violations).isNotEmpty();
        
        // Since there might be multiple violations (NotBlank + Pattern), 
        // we just check that at least one is about content type being required
        boolean hasRequiredError = violations.stream()
            .anyMatch(v -> v.getMessage().contains("required") && 
                           v.getPropertyPath().toString().equals("contentType"));
        
        assertThat(hasRequiredError).isTrue();
    }

    @ParameterizedTest
    @ValueSource(strings = {
        "image/jpeg", "image/png", "image/gif", "image/webp"
    })
    void whenContentTypeIsValid_thenNoViolations(String contentType) {
        // Given
        validImage.setContentType(contentType);

        // When
        Set<ConstraintViolation<Image>> violations = validator.validate(validImage);

        // Then
        assertThat(violations).isEmpty();
    }

    @ParameterizedTest
    @ValueSource(strings = {
        "image/bmp", "image/tiff", "application/pdf", "text/plain", "invalid"
    })
    void whenContentTypeIsInvalid_thenViolation(String contentType) {
        // Given
        validImage.setContentType(contentType);

        // When
        Set<ConstraintViolation<Image>> violations = validator.validate(validImage);

        // Then
        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage())
            .isEqualTo("Only JPEG, PNG, GIF, and WebP images are allowed");
    }

    @Test
    void whenUrlIsNull_thenViolation() {
        // Given
        validImage.setUrl(null);

        // When
        Set<ConstraintViolation<Image>> violations = validator.validate(validImage);

        // Then
        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage()).isEqualTo("URL is required");
    }

    @Test
    void whenUrlIsBlank_thenViolation() {
        // Given
        validImage.setUrl("   ");

        // When
        Set<ConstraintViolation<Image>> violations = validator.validate(validImage);

        // Then
        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage()).isEqualTo("URL is required");
    }

    @Test
    void whenPropertyIsNull_thenViolation() {
        // Given
        validImage.setProperty(null);

        // When
        Set<ConstraintViolation<Image>> violations = validator.validate(validImage);

        // Then
        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage()).isEqualTo("Property is required");
    }

    @Test
    void whenToString_thenPropertyIsExcluded() {
        // Given
        validImage.setId(1L);
        validImage.setFileName("test-image.jpg");
        validImage.setContentType("image/jpeg");
        validImage.setUrl("https://example.com/images/test-image.jpg");
        validImage.setProperty(testProperty);

        // When
        String toString = validImage.toString();

        // Then
        assertThat(toString).contains("id=1")
            .contains("fileName=test-image.jpg")
            .contains("contentType=image/jpeg")
            .contains("url=https://example.com/images/test-image.jpg")
            .doesNotContain("property=");
    }
} 