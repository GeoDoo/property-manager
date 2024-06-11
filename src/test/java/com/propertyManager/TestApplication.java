package com.propertyManager;

import org.springframework.boot.SpringApplication;

public class TestApplication {

	public static void main(String[] args) {
		SpringApplication.from(Application::main).with(com.propertyManager.TestcontainersConfiguration.class).run(args);
	}

}
