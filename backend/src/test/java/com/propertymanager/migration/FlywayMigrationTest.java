package com.propertymanager.migration;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class FlywayMigrationTest {

    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @Test
    public void testUserTableCreation() {
        // Query the database metadata to check if the users table exists with the right structure
        Map<String, Object> tableInfo = jdbcTemplate.queryForMap(
                "SELECT column_name, data_type " +
                "FROM information_schema.columns " +
                "WHERE table_name = 'users' AND column_name = 'id'");
        
        // The ID column should be of type bigint
        assertNotNull(tableInfo);
        assertEquals("id", tableInfo.get("column_name"));
        assertEquals("bigint", tableInfo.get("data_type"));
    }
    
    @Test 
    public void testPropertyTableForeignKeys() {
        // Check if the properties table has the foreign keys to the users table
        Map<String, Object> createdByColumn = jdbcTemplate.queryForMap(
                "SELECT column_name, data_type " +
                "FROM information_schema.columns " +
                "WHERE table_name = 'properties' AND column_name = 'created_by'");
        
        Map<String, Object> lastModifiedByColumn = jdbcTemplate.queryForMap(
                "SELECT column_name, data_type " +
                "FROM information_schema.columns " +
                "WHERE table_name = 'properties' AND column_name = 'last_modified_by'");
        
        // Both columns should be of type bigint
        assertNotNull(createdByColumn);
        assertEquals("created_by", createdByColumn.get("column_name"));
        assertEquals("bigint", createdByColumn.get("data_type"));
        
        assertNotNull(lastModifiedByColumn);
        assertEquals("last_modified_by", lastModifiedByColumn.get("column_name"));
        assertEquals("bigint", lastModifiedByColumn.get("data_type"));
    }
    
    @Test
    public void testMigrationV3Content() throws IOException {
        // Check the content of the V3 migration file to ensure it uses BIGSERIAL for IDs
        Path migrationPath = Paths.get("src/main/resources/db/migration/V3__Add_users_table.sql");
        String migrationContent = Files.readString(migrationPath);
        
        // Assert that the migration contains BIGSERIAL for user IDs
        assertTrue(migrationContent.contains("id BIGSERIAL PRIMARY KEY"),
                "Migration should use BIGSERIAL for user IDs");
        
        // Assert that the migration adds BIGINT foreign keys to properties table
        assertTrue(migrationContent.contains("ADD COLUMN created_by BIGINT"),
                "Migration should add created_by as BIGINT");
        assertTrue(migrationContent.contains("ADD COLUMN last_modified_by BIGINT"),
                "Migration should add last_modified_by as BIGINT");
    }
} 