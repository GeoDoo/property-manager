# Property Manager

## Backend
![Backend Tests](https://github.com/GeoDoo/property-manager/actions/workflows/backend.yml/badge.svg)
![Backend Coverage](https://github.com/GeoDoo/property-manager/blob/main/.github/badges/jacoco.svg)
![Backend Branches](https://github.com/GeoDoo/property-manager/blob/main/.github/badges/branches.svg)

## Frontend
![Frontend Tests](https://github.com/GeoDoo/property-manager/actions/workflows/frontend.yml/badge.svg)
![Frontend Coverage](https://github.com/GeoDoo/property-manager/blob/main/.github/badges/frontend-coverage.svg)
![Frontend Branches](https://github.com/GeoDoo/property-manager/blob/main/.github/badges/frontend-branches.svg)

A full-stack application for managing real estate properties, built with Spring Boot and React.

## Features

- Property listing and management
- Advanced property search with multiple filters (price, bedrooms, bathrooms, location)
- Image upload and management for properties
- RESTful API with robust validation and error handling
- Testing with real-world scenarios using TestContainers
- Continuous Integration with GitHub Actions
- Code coverage reporting via GitHub Pages

## Tech Stack

### Backend
- Spring Boot 3.2.0
- PostgreSQL
- JPA/Hibernate
- Flyway for database migrations
- TestContainers for integration testing
- JaCoCo for code coverage analysis

### Frontend
- React
- TypeScript
- Material-UI
- React Router
- Axios

For more detailed information about our technology choices and standards, please refer to [TECH_STACK.md](./TECH_STACK.md).

## Getting Started

### Prerequisites

- Docker and Docker Compose
- JDK 17
- Node.js 18+

### Running the Application

1. Clone the repository:
   ```bash
   git clone https://github.com/GeoDoo/property-manager.git
   cd property-manager
   ```

2. Set up Git hooks:
   ```bash
   git config core.hooksPath .githooks
   ```
   This enables pre-commit hooks that enforce our technology standards.

3. Start the application using Docker Compose:
   ```bash
   docker-compose up
   ```

### Running Tests

#### Local Testing

Run tests locally with Gradle:

```bash
cd backend
./gradlew test
```

Generate a test coverage report:

```bash
./gradlew jacocoTestReport
```

The report will be available at `backend/build/reports/jacoco/test/html/index.html`

#### Docker-based Testing

Run tests in a Docker container:

```bash
docker-compose -f docker-compose.test.yml up --build test
```

## Recent Updates

- **Property Model**: Simplified property model by removing redundant fields
- **Service Layer**: Reorganized service implementations into a dedicated package
- **Exception Handling**: Enhanced ResourceNotFoundException with structured data
- **Test Improvements**: Made tests more resilient to message changes with better assertions
- **Docker Testing**: Added dedicated Docker configuration for running tests in isolation
- **Coverage Reporting**: Implemented automated JaCoCo coverage reporting via GitHub Pages

## Code Coverage

View our detailed code coverage reports:
- Backend: [GitHub Pages](https://geodoo.github.io/property-manager/)
- Frontend: Available in the test artifacts of our GitHub Actions workflows

We monitor code coverage for both backend and frontend components to ensure high-quality code:

### Backend Coverage Areas
- Configuration
- Exception handling
- Service implementations
- Controllers
- Models

### Frontend Coverage Areas
- Components
- Services
- Utilities

All coverage metrics are automatically updated with every push to the main branch and displayed in the badges at the top of this README.

## Project Structure

```
property-manager/
├── backend/                  # Spring Boot application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/        # Java source code
│   │   │   └── resources/   # Application properties, migrations
│   │   └── test/            # Test classes
│   ├── build.gradle         # Gradle configuration
│   └── Dockerfile           # Docker configuration for backend
├── frontend/                 # React application
├── docker-compose.yml       # Docker Compose for development
├── docker-compose.test.yml  # Docker Compose for testing
└── README.md                # Project documentation
```

## Contributing

1. Always consult TECH_STACK.md before introducing new libraries or tools
2. Run tests before committing
3. Ensure code coverage remains above 70%
4. Follow existing code conventions
5. Add documentation for new features

## Security Standards

This project follows strict security practices:

1. **ALWAYS USE .env FILES FOR SECRETS AND SENSITIVE DATA**
   - Never hardcode credentials in application files
   - All sensitive information must be passed through environment variables
   - Use the provided .env.example as a template

2. **Environment Variable Usage**
   - Backend: Access via `${VARIABLE_NAME}` in application.properties
   - Frontend: Access via `import.meta.env.VITE_VARIABLE_NAME` in code
   - Always provide a secure default: `${JWT_SECRET:secure_default}`

3. **Secret Management**
   - JWT authentication secrets are managed via environment variables
   - Database credentials are managed via environment variables
   - Production secrets should be rotated regularly

## Working with AI Assistants

When asking AI tools for help with this project, use the provided command-line tool to ensure consistency:

```bash
# Copy the standardized AI prompt template to your clipboard
aip  # Short alias for ai-prompt
```

This will copy a template to your clipboard that you can paste at the beginning of your conversation with any AI assistant. The template reminds the AI about our technology constraints and standards.

For more details on AI guidelines, see `.github/AI_GUIDELINES.md` and `.github/AI_PROMPT_TEMPLATE.md`.