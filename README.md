# Property Manager

A full-stack application for managing property listings with image upload capabilities.

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.2.4
- Spring Data JPA
- PostgreSQL
- Gradle
- Docker

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Docker

## Features
- Property CRUD operations
- Image upload and management
- Responsive design
- Docker containerization
- Health check endpoints
- Input validation
- Error handling
- Logging

## Prerequisites
- Java 17
- Node.js 18+
- Docker and Docker Compose
- PostgreSQL (optional, as it's included in Docker setup)

## Getting Started

### Using Docker (Recommended)

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/property-manager.git
   cd property-manager
   ```

2. Start the application:
   ```bash
   docker compose up -d
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8080
   - Backend Health Check: http://localhost:8080/actuator/health

### Manual Setup

#### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Build the project:
   ```bash
   ./gradlew build
   ```

3. Run the application:
   ```bash
   ./gradlew bootRun
   ```

#### Frontend Setup
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
   npm run dev
   ```

## API Endpoints

### Properties
- `GET /api/properties` - Get all properties
- `GET /api/properties/{id}` - Get property by ID
- `POST /api/properties` - Create new property
- `PUT /api/properties/{id}` - Update property
- `DELETE /api/properties/{id}` - Delete property

### Images
- `POST /api/properties/{propertyId}/images` - Upload image for property
- `GET /api/properties/{propertyId}/images` - Get all images for property
- `DELETE /api/images/{id}` - Delete image
- `GET /images/{filename}` - Serve image file

## Environment Variables

### Backend
- `SPRING_DATASOURCE_URL` - Database URL
- `SPRING_DATASOURCE_USERNAME` - Database username
- `SPRING_DATASOURCE_PASSWORD` - Database password
- `UPLOAD_PATH` - Path for storing uploaded images

### Frontend
- `VITE_API_URL` - Backend API URL

## Recent Changes
- Added Spring Boot Actuator for health checks
- Improved error handling with custom exceptions
- Added input validation for properties and images
- Enhanced logging throughout the application
- Optimized CORS configuration
- Removed redundant configuration settings
- Added proper documentation

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Project Status

![Tests](https://github.com/georgioskarametas/property-manager/actions/workflows/test.yml/badge.svg)
![Coverage](https://img.shields.io/badge/coverage-0%25-red.svg)
