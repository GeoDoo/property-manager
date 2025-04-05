package com.propertymanager.model;

import org.junit.jupiter.api.Test;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import java.lang.reflect.Field;

import static org.junit.jupiter.api.Assertions.*;

public class PropertyEntityTest {

    @Test
    public void testPropertyIdFieldHasBigIntColumnDefinition() throws NoSuchFieldException {
        // Get the id field from the Property class
        Field idField = Property.class.getDeclaredField("id");
        
        // Get the @Column annotation from the id field
        Column columnAnnotation = idField.getAnnotation(Column.class);
        
        // Assert that the columnDefinition is "BIGINT"
        assertNotNull(columnAnnotation, "Column annotation should be present on id field");
        assertEquals("BIGINT", columnAnnotation.columnDefinition(), 
                    "Property id field should have BIGINT column definition");
    }
    
    @Test
    public void testCreatedByRelation() throws NoSuchFieldException {
        // Get the createdBy field from the Property class
        Field createdByField = Property.class.getDeclaredField("createdBy");
        
        // Check that it has a ManyToOne annotation
        ManyToOne manyToOneAnnotation = createdByField.getAnnotation(ManyToOne.class);
        assertNotNull(manyToOneAnnotation, "createdBy field should have ManyToOne annotation");
        
        // Check that it has the right JoinColumn name
        JoinColumn joinColumnAnnotation = createdByField.getAnnotation(JoinColumn.class);
        assertNotNull(joinColumnAnnotation, "createdBy field should have JoinColumn annotation");
        assertEquals("created_by", joinColumnAnnotation.name(), 
                    "JoinColumn should reference created_by column");
    }
    
    @Test
    public void testLastModifiedByRelation() throws NoSuchFieldException {
        // Get the lastModifiedBy field from the Property class
        Field lastModifiedByField = Property.class.getDeclaredField("lastModifiedBy");
        
        // Check that it has a ManyToOne annotation
        ManyToOne manyToOneAnnotation = lastModifiedByField.getAnnotation(ManyToOne.class);
        assertNotNull(manyToOneAnnotation, "lastModifiedBy field should have ManyToOne annotation");
        
        // Check that it has the right JoinColumn name
        JoinColumn joinColumnAnnotation = lastModifiedByField.getAnnotation(JoinColumn.class);
        assertNotNull(joinColumnAnnotation, "lastModifiedBy field should have JoinColumn annotation");
        assertEquals("last_modified_by", joinColumnAnnotation.name(), 
                    "JoinColumn should reference last_modified_by column");
    }
    
    @Test
    public void testPropertyUserRelations() {
        // Create a user 
        User user = new User();
        user.setId(1L);
        user.setUsername("admin");
        
        // Create a property with created_by and last_modified_by set to the user
        Property property = Property.builder()
                .id(1L)
                .address("123 Test St")
                .description("Test Property")
                .price(200000.0)
                .bedrooms(3)
                .bathrooms(2)
                .squareFootage(1500.0)
                .createdBy(user)
                .lastModifiedBy(user)
                .build();
        
        // Verify the relations
        assertNotNull(property.getCreatedBy(), "createdBy should not be null");
        assertEquals(user.getId(), property.getCreatedBy().getId(), 
                    "createdBy should have the correct user ID");
        assertEquals(user.getUsername(), property.getCreatedBy().getUsername(), 
                    "createdBy should have the correct username");
                    
        assertNotNull(property.getLastModifiedBy(), "lastModifiedBy should not be null");
        assertEquals(user.getId(), property.getLastModifiedBy().getId(), 
                    "lastModifiedBy should have the correct user ID");
        assertEquals(user.getUsername(), property.getLastModifiedBy().getUsername(), 
                    "lastModifiedBy should have the correct username");
    }
} 