package com.propertymanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = "com.propertymanager")
@EntityScan("com.propertymanager.entity")
@EnableJpaRepositories("com.propertymanager.repository")
public class PropertyManagerApplication {

    public static void main(String[] args) {
        SpringApplication.run(PropertyManagerApplication.class, args);
    }
} 