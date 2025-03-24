package com.propertyManager;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Bean;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.utility.DockerImageName;

@TestConfiguration
public class TestcontainersConfiguration {
	
	@Bean
	@ServiceConnection(name = "postgres")
	PostgreSQLContainer<?> postgresContainer() {
		return new PostgreSQLContainer<>(DockerImageName.parse("postgres:15-alpine"))
				.withDatabaseName("property_manager")
				.withUsername("test")
				.withPassword("test");
	}

	@Bean
	@ServiceConnection(name = "vault")
	GenericContainer<?> vaultContainer() {
		return new GenericContainer<>(DockerImageName.parse("hashicorp/vault:1.13"))
				.withExposedPorts(8200)
				.withEnv("VAULT_DEV_ROOT_TOKEN_ID", "dev-token")
				.withEnv("VAULT_DEV_LISTEN_ADDRESS", "0.0.0.0:8200");
	}
}
