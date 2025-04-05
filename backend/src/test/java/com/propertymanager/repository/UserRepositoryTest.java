package com.propertymanager.repository;

import com.propertymanager.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    void testUserIdIsBigInt() {
        // Create and save a user
        User adminUser = new User();
        adminUser.setUsername("admin");
        adminUser.setPassword("password");
        adminUser.setRole("ROLE_ADMIN");

        User savedUser = userRepository.save(adminUser);
        assertNotNull(savedUser.getId());
    }

    @Test
    void testFindByUsername() {
        // Create and save a user
        User adminUser = new User();
        adminUser.setUsername("admin");
        adminUser.setPassword("password");
        adminUser.setRole("ROLE_ADMIN");
        userRepository.save(adminUser);

        // Create and save another user
        User secondUser = new User();
        secondUser.setUsername("user");
        secondUser.setPassword("userpass");
        secondUser.setRole("ROLE_USER");
        userRepository.save(secondUser);

        // Find by username
        Optional<User> foundUser = userRepository.findByUsername("admin");
        assertTrue(foundUser.isPresent());
        assertEquals("admin", foundUser.get().getUsername());
        assertEquals("ROLE_ADMIN", foundUser.get().getRole());

        // Find non-existent user
        Optional<User> notFoundUser = userRepository.findByUsername("nonexistent");
        assertFalse(notFoundUser.isPresent());
    }
}