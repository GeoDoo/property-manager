package com.propertymanager.repository;

import com.propertymanager.model.Property;
import com.propertymanager.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
public class PropertyRepositoryTest {

    @Autowired
    private PropertyRepository propertyRepository;
    
    @Autowired
    private UserRepository userRepository;

    private Property testProperty;
    private User adminUser;

    @BeforeEach
    void setUp() {
        // Clear all data
        propertyRepository.deleteAll();
        userRepository.deleteAll();
        
        // Create a test admin user
        adminUser = new User();
        adminUser.setUsername("admin");
        adminUser.setPassword("$2a$10$rBV2JDeWW3.vKyeQplBd3O4ihQoO4.4./aJjFJsYY6K8zH.76Jce2");
        adminUser.setRole("ROLE_ADMIN");
        adminUser = userRepository.save(adminUser);
        
        // Create a test property
        testProperty = Property.builder()
            .address("123 Test Street")
            .description("Test property for repository tests")
            .price(250000.0)
            .bedrooms(3)
            .bathrooms(2)
            .squareFootage(1500.0)
            .createdBy(adminUser)
            .lastModifiedBy(adminUser)
            .build();
        
        testProperty = propertyRepository.save(testProperty);
    }

    @Test
    public void testUserIdIsBigInt() {
        assertNotNull(adminUser.getId());
        assertTrue(adminUser.getId() > 0); 
        assertEquals(Long.class, adminUser.getId().getClass());
    }
    
    @Test
    public void testPropertyIdIsBigInt() {
        assertNotNull(testProperty.getId());
        assertTrue(testProperty.getId() > 0);
        assertEquals(Long.class, testProperty.getId().getClass());
    }
    
    @Test
    public void testPropertyUserReferenceIsBigInt() {
        assertNotNull(testProperty.getCreatedBy());
        assertNotNull(testProperty.getLastModifiedBy());
        
        assertEquals(adminUser.getId(), testProperty.getCreatedBy().getId());
        assertEquals(adminUser.getId(), testProperty.getLastModifiedBy().getId());
    }
    
    @Test
    public void testBasicCrudOperations() {
        // Find
        Optional<Property> found = propertyRepository.findById(testProperty.getId());
        assertTrue(found.isPresent());
        assertEquals(testProperty.getAddress(), found.get().getAddress());
        
        // Update
        found.get().setPrice(275000.0);
        Property updated = propertyRepository.save(found.get());
        assertEquals(275000.0, updated.getPrice());
        
        // Delete
        propertyRepository.delete(updated);
        assertFalse(propertyRepository.existsById(updated.getId()));
    }
    
    @Test
    public void testFindAll() {
        List<Property> properties = propertyRepository.findAll();
        assertFalse(properties.isEmpty());
        assertEquals(1, properties.size());
        assertEquals(testProperty.getId(), properties.get(0).getId());
    }
} 