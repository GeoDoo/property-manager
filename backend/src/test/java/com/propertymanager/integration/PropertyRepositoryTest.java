package com.propertymanager.integration;

import com.propertymanager.model.Property;
import com.propertymanager.repository.PropertyRepository;
import com.propertymanager.service.PropertyService;
import com.propertymanager.exception.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.transaction.annotation.Transactional;
import jakarta.validation.ConstraintViolationException;
import jakarta.persistence.criteria.Predicate;
import java.util.List;
import java.util.ArrayList;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@Transactional
public class PropertyRepositoryTest extends AbstractIntegrationTest {

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private PropertyService propertyService;

    private Property testProperty;

    @BeforeEach
    void setUp() {
        propertyRepository.deleteAll();
        
        // Create test properties for search and filter tests
        createProperty("123 London Road", 500000.0, 3, 2, 1800.0);
        createProperty("456 London Road", 750000.0, 4, 3, 2200.0);
        createProperty("789 Paris Street", 1000000.0, 5, 4, 3000.0);
        createProperty("321 Berlin Ave", 450000.0, 2, 1, 1500.0);

        // Create a test property for CRUD operations
        testProperty = Property.builder()
            .address("123 Test St")
            .description("Test Description")
            .price(500000.0)
            .bedrooms(3)
            .bathrooms(2)
            .squareFootage(2000.0)
            .build();
        testProperty = propertyRepository.save(testProperty);
    }

    private Property createProperty(String address, Double price, Integer bedrooms, Integer bathrooms, Double squareFootage) {
        Property property = Property.builder()
            .address(address)
            .price(price)
            .bedrooms(bedrooms)
            .bathrooms(bathrooms)
            .squareFootage(squareFootage)
            .build();
        return propertyRepository.save(property);
    }

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Test
    void shouldPerformCRUDOperations() {
        // Test Create and Read
        assertThat(testProperty.getId()).isNotNull();
        assertThat(testProperty.getAddress()).isEqualTo("123 Test St");
        assertThat(testProperty.getPrice()).isEqualTo(500000.0);
        assertThat(testProperty.getBedrooms()).isEqualTo(3);

        // Test Update
        testProperty.setPrice(550000.0);
        Property updatedProperty = propertyRepository.save(testProperty);
        assertThat(updatedProperty.getPrice()).isEqualTo(550000.0);
        assertThat(updatedProperty.getId()).isEqualTo(testProperty.getId());

        // Test Delete
        propertyRepository.deleteById(testProperty.getId());
        assertThat(propertyRepository.findById(testProperty.getId())).isEmpty();
    }

    @Test
    void shouldNotSavePropertyWithNullAddress() {
        // Given
        Property property = Property.builder()
            .price(300000.0)
            .bedrooms(2)
            .bathrooms(1)
            .squareFootage(1200.0)
            .build();

        // When/Then
        assertThrows(ConstraintViolationException.class, () -> {
            propertyRepository.saveAndFlush(property);
        });
    }

    @Test
    void shouldNotSavePropertyWithNegativePrice() {
        // Given
        Property property = Property.builder()
            .address("123 Negative Price St")
            .price(-100000.0)
            .bedrooms(2)
            .bathrooms(1)
            .squareFootage(1200.0)
            .build();

        // When/Then
        assertThrows(ConstraintViolationException.class, () -> {
            propertyRepository.saveAndFlush(property);
        });
    }

    @Test
    void shouldFindPropertiesByAddressContaining() {
        // When
        Specification<Property> spec = (root, query, cb) -> 
            cb.like(cb.lower(root.get("address")), "%london%".toLowerCase());
        List<Property> properties = propertyRepository.findAll(spec);

        // Then
        assertThat(properties).hasSize(2);
        assertThat(properties).allMatch(p -> p.getAddress().toLowerCase().contains("london"));
    }

    @Test
    void shouldFindPropertiesInPriceRange() {
        // First, verify all properties in the database
        List<Property> allProperties = propertyRepository.findAll();
        System.out.println("All properties in database:");
        allProperties.forEach(p -> System.out.println("Address: " + p.getAddress() + ", Price: " + p.getPrice()));

        // When
        Specification<Property> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.greaterThanOrEqualTo(root.get("price"), 450000.0));
            predicates.add(cb.lessThanOrEqualTo(root.get("price"), 750000.0));
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        List<Property> properties = propertyRepository.findAll(spec);

        // Print filtered properties
        System.out.println("\nFiltered properties (450000.0 <= price <= 750000.0):");
        properties.forEach(p -> System.out.println("Address: " + p.getAddress() + ", Price: " + p.getPrice()));

        // Then
        assertThat(properties).hasSize(4);
        assertThat(properties).allMatch(p -> p.getPrice() >= 450000.0 && p.getPrice() <= 750000.0);
    }

    @Test
    void shouldFindPropertiesByMinimumBedrooms() {
        // When
        Specification<Property> spec = (root, query, cb) ->
            cb.greaterThanOrEqualTo(root.get("bedrooms"), 4);
        List<Property> properties = propertyRepository.findAll(spec);

        // Then
        assertThat(properties).hasSize(2);
        assertThat(properties).allMatch(p -> p.getBedrooms() >= 4);
    }

    @Test
    void shouldFindPropertiesWithCombinedCriteria() {
        // When
        Specification<Property> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.like(cb.lower(root.get("address")), "%london%".toLowerCase()));
            predicates.add(cb.greaterThanOrEqualTo(root.get("price"), 600000.0));
            predicates.add(cb.greaterThanOrEqualTo(root.get("bedrooms"), 4));
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        List<Property> properties = propertyRepository.findAll(spec);

        // Then
        assertThat(properties).hasSize(1);
        Property property = properties.get(0);
        assertThat(property.getAddress().toLowerCase()).contains("london");
        assertThat(property.getPrice()).isGreaterThanOrEqualTo(600000.0);
        assertThat(property.getBedrooms()).isGreaterThanOrEqualTo(4);
    }

    @Test
    void shouldPaginateResults() {
        // Given
        Pageable firstPage = PageRequest.of(0, 2);
        Pageable secondPage = PageRequest.of(1, 2);

        // When
        Page<Property> firstPageResult = propertyRepository.findAll(firstPage);
        Page<Property> secondPageResult = propertyRepository.findAll(secondPage);

        // Then
        assertThat(firstPageResult.getContent()).hasSize(2);
        assertThat(secondPageResult.getContent()).hasSize(2);
        assertThat(firstPageResult.getTotalElements()).isEqualTo(5); // Including testProperty
        assertThat(firstPageResult.getTotalPages()).isEqualTo(3);    // Ceil(5/2) = 3 pages
        assertThat(firstPageResult.getNumber()).isEqualTo(0);
        assertThat(secondPageResult.getNumber()).isEqualTo(1);
    }

    @Test
    void shouldPaginateAndSortResults() {
        // Given
        Pageable pageable = PageRequest.of(0, 2, Sort.by(Sort.Direction.DESC, "price"));

        // When
        Page<Property> result = propertyRepository.findAll(pageable);

        // Then
        assertThat(result.getContent()).hasSize(2);
        assertThat(result.getContent().get(0).getPrice()).isEqualTo(1000000.0); // Paris Street
        assertThat(result.getContent().get(1).getPrice()).isEqualTo(750000.0);  // London Road
    }

    @Test
    void shouldPaginateFilteredResults() {
        // Given
        Specification<Property> spec = (root, query, cb) ->
            cb.greaterThanOrEqualTo(root.get("price"), 500000.0);
        Pageable pageable = PageRequest.of(0, 2);

        // When
        Page<Property> result = propertyRepository.findAll(spec, pageable);

        // Then
        assertThat(result.getContent()).hasSize(2);
        assertThat(result.getTotalElements()).isEqualTo(4); // Total matching properties
        assertThat(result.getTotalPages()).isEqualTo(2);    // Ceil(4/2) = 2 pages
        assertThat(result.getContent()).allMatch(p -> p.getPrice() >= 500000.0);
    }

    @Test
    void shouldPaginateAndSortFilteredResults() {
        // Given
        Specification<Property> spec = (root, query, cb) ->
            cb.like(cb.lower(root.get("address")), "%london%".toLowerCase());
        Pageable pageable = PageRequest.of(0, 1, Sort.by(Sort.Direction.ASC, "price"));

        // When
        Page<Property> result = propertyRepository.findAll(spec, pageable);

        // Then
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getTotalElements()).isEqualTo(2);
        assertThat(result.getTotalPages()).isEqualTo(2);
        assertThat(result.getContent().get(0).getPrice()).isEqualTo(500000.0); // Cheaper London property
        assertThat(result.getContent().get(0).getAddress()).contains("London");
    }

    @Test
    void shouldReturnEmptyPageWhenNoResults() {
        // Given
        propertyRepository.deleteAll();
        Pageable pageable = PageRequest.of(0, 10);

        // When
        Page<Property> result = propertyRepository.findAll(pageable);

        // Then
        assertThat(result.getContent()).isEmpty();
        assertThat(result.getTotalElements()).isZero();
        assertThat(result.getTotalPages()).isZero();
        assertThat(result.getNumber()).isZero();
    }

    @Test
    void shouldReturnEmptyPageWhenNoMatchingFilters() {
        // Given
        Specification<Property> spec = (root, query, cb) ->
            cb.like(root.get("address"), "%nonexistent%");
        Pageable pageable = PageRequest.of(0, 10);

        // When
        Page<Property> result = propertyRepository.findAll(spec, pageable);

        // Then
        assertThat(result.getContent()).isEmpty();
        assertThat(result.getTotalElements()).isZero();
        assertThat(result.getTotalPages()).isZero();
    }

    @Test
    void shouldReturnLastPageCorrectly() {
        // Given
        Pageable lastPage = PageRequest.of(2, 2); // Third page with 2 items per page

        // When
        Page<Property> result = propertyRepository.findAll(lastPage);

        // Then
        assertThat(result.getContent()).hasSize(1); // Last page has 1 item
        assertThat(result.isLast()).isTrue();
        assertThat(result.hasNext()).isFalse();
        assertThat(result.getNumber()).isEqualTo(2);
    }

    @Test
    void shouldHandlePageRequestBeyondTotalPages() {
        // Given
        Pageable beyondLastPage = PageRequest.of(3, 2); // Fourth page when we have three pages

        // When
        Page<Property> result = propertyRepository.findAll(beyondLastPage);

        // Then
        assertThat(result.getContent()).isEmpty();
        assertThat(result.getTotalElements()).isEqualTo(5); // Total records still correct
        assertThat(result.getTotalPages()).isEqualTo(3);    // Total pages still correct
        assertThat(result.getNumber()).isEqualTo(3);        // Page number preserved
        assertThat(result.isLast()).isTrue();
        assertThat(result.hasNext()).isFalse();
    }

    @Test
    void shouldHandlePageSizeLargerThanTotalElements() {
        // Given
        Pageable largePage = PageRequest.of(0, 10); // Page size larger than total records

        // When
        Page<Property> result = propertyRepository.findAll(largePage);

        // Then
        assertThat(result.getContent()).hasSize(5); // All records returned
        assertThat(result.getTotalElements()).isEqualTo(5);
        assertThat(result.getTotalPages()).isEqualTo(1);    // Only one page needed
        assertThat(result.isLast()).isTrue();
        assertThat(result.isFirst()).isTrue();
        assertThat(result.hasNext()).isFalse();
    }

    @Test
    void shouldNotSavePropertyWithZeroBedrooms() {
        // Given
        Property property = Property.builder()
            .address("123 Zero Bedrooms")
            .price(300000.0)
            .bedrooms(0)
            .bathrooms(1)
            .squareFootage(1200.0)
            .build();

        // When/Then
        assertThrows(ConstraintViolationException.class, () -> {
            propertyRepository.saveAndFlush(property);
        });
    }

    @Test
    void shouldNotSavePropertyWithNegativeSquareFootage() {
        // Given
        Property property = Property.builder()
            .address("123 Negative Space")
            .price(300000.0)
            .bedrooms(2)
            .bathrooms(1)
            .squareFootage(-100.0)
            .build();

        // When/Then
        assertThrows(ConstraintViolationException.class, () -> {
            propertyRepository.saveAndFlush(property);
        });
    }

    @Test
    void shouldNotSavePropertyWithExcessivelyLongAddress() {
        // Given
        String tooLongAddress = "a".repeat(1001); // Assuming max length is 1000
        Property property = Property.builder()
            .address(tooLongAddress)
            .price(300000.0)
            .bedrooms(2)
            .bathrooms(1)
            .squareFootage(1200.0)
            .build();

        // When/Then
        assertThrows(ConstraintViolationException.class, () -> {
            propertyRepository.saveAndFlush(property);
        });
    }

    @Test
    void shouldNotDeleteNonExistentProperty() {
        // Given
        Long nonExistentId = 99999L;

        // When/Then
        assertThrows(ResourceNotFoundException.class, () -> {
            propertyService.deleteProperty(nonExistentId);
        });
    }

    @Test
    void shouldNotUpdateNonExistentProperty() {
        // Given
        Long nonExistentId = 999999L;
        Property property = Property.builder()
            .address("123 Non-existent St")
            .price(300000.0)
            .bedrooms(2)
            .bathrooms(1)
            .squareFootage(1200.0)
            .build();

        // When/Then
        assertThrows(ResourceNotFoundException.class, () -> {
            propertyService.updateProperty(nonExistentId, property);
        });
    }
} 