# Property Manager Technology Stack

## Build Tools
- **Backend**: Gradle ONLY (No Maven)
- **Frontend**: npm + Vite

## Backend
- **Language**: Java 17
- **Framework**: Spring Boot 3.2.0
- **Database**: PostgreSQL
- **ORM**: JPA/Hibernate
- **Migrations**: Flyway
- **Testing**: JUnit, TestContainers
- **Coverage**: JaCoCo

## Frontend
- **Language**: TypeScript
- **Framework**: React 18
- **Routing**: React Router v7
- **State Management**: React Query
- **Styling**: TailwindCSS
- **HTTP Client**: Axios
- **Testing**: Jest + React Testing Library
- **API Mocking**: MSW

## Infrastructure
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions

## Standards
- Backend follows standard Spring Boot project structure
- RESTful API design principles
- Controller → Service → Repository architecture
- Frontend uses functional components with hooks

## Security
- **ALWAYS USE .env FOR SECRETS AND SENSITIVE DATA**
- No hardcoded secrets in application code or configuration files
- All sensitive values must be passed through environment variables
- Environment variable references in configuration files with secure defaults
- JWT used for authentication with proper secret management
- Sensitive operations require admin role

## Enforcement
- **Pre-commit Hook**: A Git pre-commit hook is in place to prevent introducing incompatible technologies
  - Blocks Maven files in backend
  - Prevents Redux, jQuery, and CSS-in-JS libraries in frontend
  - Setup: The hooks are automatically configured when you clone the repository
  - Location: `.githooks/pre-commit`
- **AI Guidelines**: When using AI tools with this codebase
  - Always make AI assistants aware of this TECH_STACK.md file first
  - Reference the AI guidelines in `.github/AI_GUIDELINES.md`
  - Ask AI to verify its suggestions against our standards
  - If AI suggests incompatible tech, point it back to these guidelines

## Do Not Use
- Maven (use Gradle only)
- Redux (use React Query instead)
- CSS-in-JS (use TailwindCSS instead)
- jQuery (use native DOM methods instead)
- Class components in React
- Hardcoded credentials or secrets (use .env files) 