# Property Manager

A modern web application for managing property listings, built with Spring Boot and React.

## Features

- Create, read, update, and delete property listings
- Property details include:
  - Address
  - Description (supports long text)
  - Price
  - Number of bedrooms
  - Number of bathrooms
  - Square footage

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.x
- PostgreSQL 14
- Docker

### Frontend
- React with TypeScript
- Vite
- TanStack Query
- Tailwind CSS
- Nginx

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Java 17 (for local development)

### Running the Application

1. Clone the repository:
```bash
git clone <repository-url>
cd property-manager
```

2. Start the application using Docker Compose:
```bash
docker compose up --build
```

The application will be available at:
- Frontend: http://localhost
- Backend API: http://localhost:8081/api
- PostgreSQL: localhost:5432

## API Documentation

### Endpoints

#### Properties

- `GET /api/properties` - List all properties
- `GET /api/properties/{id}` - Get a specific property
- `POST /api/properties` - Create a new property
- `PUT /api/properties/{id}` - Update a property
- `DELETE /api/properties/{id}` - Delete a property

### Property Model

```typescript
interface Property {
    id?: number;
    address: string;      // Required
    description: string;  // Optional, supports long text
    price: number;        // Required, must be positive
    bedrooms: number;     // Optional
    bathrooms: number;    // Optional
    squareFootage: number; // Optional
}
```

## Development

### Backend Development

The backend is a Spring Boot application with the following configuration:
- Server port: 8081
- Database: PostgreSQL
- JPA/Hibernate with automatic schema updates
- Logging enabled for SQL queries

### Frontend Development

The frontend is a React application built with:
- Vite for fast development and building
- TypeScript for type safety
- TanStack Query for API data management
- Tailwind CSS for styling
- Nginx for production serving

### Environment Variables

Backend (application.properties):
```properties
spring.datasource.url=jdbc:postgresql://postgres:5432/propertymanager
spring.datasource.username=postgres
spring.datasource.password=postgres
```

## Docker Configuration

The application uses Docker Compose with three services:
1. `postgres` - PostgreSQL database
2. `backend` - Spring Boot application
3. `frontend` - React application with Nginx

Each service is configured with health checks and appropriate dependencies.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
