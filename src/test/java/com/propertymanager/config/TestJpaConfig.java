package com.propertymanager.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableJpaRepositories(basePackages = "com.propertymanager.repository")
@EnableTransactionManagement
public class TestJpaConfig {
    // Spring Boot will auto-configure the transaction manager
} 