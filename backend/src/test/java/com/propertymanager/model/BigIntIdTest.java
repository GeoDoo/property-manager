package com.propertymanager.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class BigIntIdTest {

    @Test
    public void testUserEntityHasBigIntId() {
        User user = new User();
        user.setId(Long.MAX_VALUE);
        
        assertEquals(Long.MAX_VALUE, user.getId());
        assertTrue(user.getId() > Integer.MAX_VALUE);
    }
    
    @Test
    public void testPropertyEntityHasBigIntId() {
        Property property = Property.builder()
            .id(Long.MAX_VALUE)
            .build();
            
        assertEquals(Long.MAX_VALUE, property.getId());
        assertTrue(property.getId() > Integer.MAX_VALUE);
    }
    
    @Test
    public void testPropertyUserReferences() {
        User user = new User();
        user.setId(Long.MAX_VALUE);
        
        Property property = Property.builder()
            .createdBy(user)
            .lastModifiedBy(user)
            .build();
            
        assertNotNull(property.getCreatedBy());
        assertEquals(Long.MAX_VALUE, property.getCreatedBy().getId());
        assertTrue(property.getCreatedBy().getId() > Integer.MAX_VALUE);
        
        assertNotNull(property.getLastModifiedBy());
        assertEquals(Long.MAX_VALUE, property.getLastModifiedBy().getId());
        assertTrue(property.getLastModifiedBy().getId() > Integer.MAX_VALUE);
    }
} 