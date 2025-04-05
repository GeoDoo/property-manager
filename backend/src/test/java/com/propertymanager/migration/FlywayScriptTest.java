package com.propertymanager.migration;

import org.junit.jupiter.api.Test;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import static org.junit.jupiter.api.Assertions.*;

public class FlywayScriptTest {

    @Test
    public void testBigIntColumnsInV3Migration() throws IOException {
        // Path to the V3 migration file
        Path migrationPath = Paths.get("src/main/resources/db/migration/V3__Add_users_table.sql");
        assertTrue(Files.exists(migrationPath), "Migration file should exist");
        
        String content = Files.readString(migrationPath);
        
        // Check for BIGSERIAL for user id
        assertTrue(content.contains("id BIGSERIAL PRIMARY KEY"), 
            "User id should be defined as BIGSERIAL");
            
        // Check for BIGINT for foreign key references
        assertTrue(content.contains("created_by BIGINT"), 
            "created_by should be defined as BIGINT");
        assertTrue(content.contains("last_modified_by BIGINT"), 
            "last_modified_by should be defined as BIGINT");
            
        // Check for foreign key constraints
        assertTrue(content.contains("REFERENCES users(id)"), 
            "Should have foreign key constraint to users table");
    }
} 