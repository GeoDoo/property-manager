# Property Manager

![Tests](https://github.com/GeoDoo/property-manager/actions/workflows/test.yml/badge.svg)
![Coverage](.github/badges/jacoco.svg)
![Branches](.github/badges/branches.svg)

A full-stack application for managing real estate properties, built with Spring Boot and React.

## Features

- Property listing and management
- Advanced search and filtering
- User authentication and authorization
- Responsive design
- Docker support for development and testing

## Tech Stack

### Backend
- Spring Boot 3.2.0
- PostgreSQL
- JPA/Hibernate
- Flyway for database migrations
- TestContainers for integration testing

### Frontend
- React
- TypeScript
- Material-UI
- React Router
- Axios

## Getting Started

### Prerequisites

- Docker and Docker Compose
- JDK 17
- Node.js 18+

### Running the Application

1. Clone the repository:
   ```bash
   git clone https://github.com/georgioskarametas/property-manager.git
   cd property-manager
   ```

2. Start the application using Docker Compose:
   ```bash
   docker compose up --build
   ```

3. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8081
   - Backend Health Check: http://localhost:8081/actuator/health
   - PostgreSQL: localhost:5432

### Development

#### Backend Development

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Run the application:
   ```bash
   ./gradlew bootRun
   ```

3. Run tests:
   ```bash
   ./gradlew test
   ```

#### Frontend Development

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Testing

### Running Tests

#### Backend Tests

```bash
cd backend
./gradlew test
```

#### Frontend Tests

```bash
cd frontend
npm test
```

### Test Coverage

The project uses JaCoCo for test coverage reporting. Coverage reports are:
- Generated automatically on every push to main
- Available as artifacts in GitHub Actions
- Published to GitHub Pages at: https://georgioskarametas.github.io/property-manager/coverage/
- Added as a comment on every Pull Request

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
