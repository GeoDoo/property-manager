# Property Manager

A Spring Boot application for managing real estate properties with RESTful APIs and a simple web interface.

## Features

- RESTful API endpoints for CRUD operations on properties
- H2 in-memory database for development and testing
- PostgreSQL support for production
- Simple web interface to view properties
- Comprehensive test coverage

## Technologies

- Java 21
- Spring Boot 3.2.3
- Spring Data JPA
- PostgreSQL
- H2 Database (for testing)
- JUnit 5
- Testcontainers
- Gradle

## Prerequisites

- Java 21 or higher
- Docker (for running PostgreSQL in containers)
- Gradle (included via wrapper)

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd property-manager
```

2. Build the project:
```bash
./gradlew build
```

3. Run the application:
```bash
./gradlew bootRun
```

The application will be available at `http://localhost:8080`

## API Endpoints

### Properties API

- `GET /api/properties` - Get all properties
- `GET /api/properties/{id}` - Get a specific property
- `POST /api/properties` - Create a new property
- `PUT /api/properties/{id}` - Update an existing property
- `DELETE /api/properties/{id}` - Delete a property

### Sample Request Body (POST/PUT)

```json
{
    "address": "123 Test St",
    "price": 250000.00,
    "bedrooms": 3,
    "bathrooms": 2,
    "squareFootage": 2000.0
}
```

## Testing

The project includes both unit and integration tests. To run the tests:

```bash
./gradlew test
```

Tests use:
- H2 in-memory database for repository tests
- MockMvc for controller tests
- Testcontainers for integration tests

## Project Structure 