package com.propertymanager.integration;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.util.TestPropertyValues;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

@SpringBootTest
@Testcontainers
@ActiveProfiles("test")
@ContextConfiguration(initializers = {AbstractIntegrationTest.Initializer.class})
public abstract class AbstractIntegrationTest {
    
    @Container
    protected static final PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>(DockerImageName.parse("postgres:16-alpine"))
            .withDatabaseName("test")
            .withUsername("test")
            .withPassword("test")
            .withInitScript("schema.sql")
            .withReuse(true);
    
    static {
        // Start container early to avoid race conditions
        postgres.start();
    }

    static class Initializer implements ApplicationContextInitializer<ConfigurableApplicationContext> {
        public void initialize(ConfigurableApplicationContext configurableApplicationContext) {
            TestPropertyValues.of(
                "spring.datasource.url=" + postgres.getJdbcUrl(),
                "spring.datasource.username=" + postgres.getUsername(),
                "spring.datasource.password=" + postgres.getPassword(),
                "spring.jpa.hibernate.ddl-auto=create-drop",
                "spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect",
                "spring.datasource.driver-class-name=org.postgresql.Driver",
                "spring.jpa.show-sql=true",
                "spring.datasource.hikari.maximum-pool-size=2",
                "spring.datasource.hikari.minimum-idle=1",
                "spring.datasource.hikari.connection-timeout=20000",
                "spring.datasource.hikari.idle-timeout=10000",
                "spring.datasource.hikari.max-lifetime=30000",
                "spring.security.user.name=admin",
                "spring.security.user.password=admin",
                "spring.security.user.roles=ADMIN"
            ).applyTo(configurableApplicationContext.getEnvironment());
        }
    }
} 