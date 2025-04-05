package com.propertymanager.model;

import org.junit.jupiter.api.Test;
import jakarta.persistence.Column;

import java.lang.reflect.Field;

import static org.junit.jupiter.api.Assertions.*;

public class UserEntityTest {

    @Test
    void testUserIdFieldHasBigIntColumnDefinition() {
        // This test verifies the @Column annotation is present with columnDefinition="BIGINT"
        try {
            var field = User.class.getDeclaredField("id");
            var columnAnnotation = field.getAnnotation(jakarta.persistence.Column.class);
            
            assertNotNull(columnAnnotation);
            assertEquals("BIGINT", columnAnnotation.columnDefinition());
        } catch (NoSuchFieldException e) {
            fail("id field not found in User entity");
        }
    }
    
    @Test
    void testUserDefaultConstructor() {
        User user = new User();
        
        assertNotNull(user);
        assertNull(user.getId());
        assertNull(user.getUsername());
        assertNull(user.getPassword());
        assertNull(user.getRole());
    }
    
    @Test
    void testUserFieldsInitialization() {
        User user = new User();
        user.setId(1L);
        user.setUsername("admin");
        user.setPassword("password");
        user.setRole("ROLE_ADMIN");
        
        assertEquals(1L, user.getId());
        assertEquals("admin", user.getUsername());
        assertEquals("password", user.getPassword());
        assertEquals("ROLE_ADMIN", user.getRole());
        assertTrue(user.getRole().equals("ROLE_ADMIN"));
    }
    
    @Test
    void testUserBuilderPattern() {
        User user = User.builder()
                .id(1L)
                .username("admin")
                .password("password")
                .role("ROLE_ADMIN")
                .build();
        
        assertEquals(1L, user.getId());
        assertEquals("admin", user.getUsername());
        assertEquals("password", user.getPassword());
        assertEquals("ROLE_ADMIN", user.getRole());
        assertTrue(user.getRole().equals("ROLE_ADMIN"));
    }
} 