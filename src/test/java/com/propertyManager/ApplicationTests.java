package com.propertyManager;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import javax.sql.DataSource;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Testcontainers
class ApplicationTests {

	@Container
	static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15-alpine")
			.withDatabaseName("property_manager")
			.withUsername("test")
			.withPassword("test");

	@Container
	static GenericContainer<?> vault = new GenericContainer<>("hashicorp/vault:1.13")
			.withExposedPorts(8200)
			.withEnv("VAULT_DEV_ROOT_TOKEN_ID", "dev-token")
			.withEnv("VAULT_DEV_LISTEN_ADDRESS", "0.0.0.0:8200");

	@DynamicPropertySource
	static void registerProperties(DynamicPropertyRegistry registry) {
		// Database properties
		registry.add("spring.datasource.url", postgres::getJdbcUrl);
		registry.add("spring.datasource.username", postgres::getUsername);
		registry.add("spring.datasource.password", postgres::getPassword);
		
		// Vault properties
		registry.add("spring.cloud.vault.host", () -> "localhost");
		registry.add("spring.cloud.vault.port", () -> vault.getMappedPort(8200));
		registry.add("spring.cloud.vault.scheme", () -> "http");
		registry.add("spring.cloud.vault.authentication", () -> "TOKEN");
		registry.add("spring.cloud.vault.token", () -> "dev-token");
		registry.add("spring.cloud.vault.fail-fast", () -> "false");
	}

	@Autowired
	private DataSource dataSource;

	@Test
	void contextLoads() {
		assertNotNull(dataSource);
	}

	@Test
	void testDatabaseConnection() {
		JdbcTemplate jdbc = new JdbcTemplate(dataSource);
		assertEquals(1, jdbc.queryForObject("SELECT 1", Integer.class));
	}
}
