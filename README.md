# Property Manager

A full-stack application for managing real estate properties with image upload capabilities.

## Features

- View list of properties
- Add new properties
- Edit existing properties
- Delete properties
- Upload multiple images per property
- View property details with image gallery
- Responsive design for all screen sizes

## Tech Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Query for data fetching
- React Router for navigation

### Backend
- Spring Boot 3.2.0
- Java 17
- PostgreSQL database
- JPA/Hibernate for data persistence
- Lombok for reducing boilerplate code
- File upload handling with multipart support

## Prerequisites

- Java 17 or later
- Node.js 18 or later
- PostgreSQL 15 or later
- Docker and Docker Compose (optional, for running with containers)

## Getting Started

### Running with Docker Compose (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd property-manager
```

2. Start the application:
```bash
docker-compose up
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:8081

### Running Locally

1. Start PostgreSQL database:
```bash
docker-compose up postgres
```

2. Start the backend:
```bash
cd backend
./gradlew bootRun
```

3. Start the frontend:
```bash
cd frontend
npm install
npm run dev
```

## Project Structure

### Frontend
```
frontend/
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   └── Layout.tsx
│   │   ├── Property/
│   │   │   ├── PropertyCard.tsx
│   │   │   ├── PropertyDetails.tsx
│   │   │   ├── PropertyForm.tsx
│   │   │   └── PropertyList.tsx
│   │   └── ImageSlider.tsx
│   ├── config/
│   │   └── routes.ts
│   ├── services/
│   │   └── propertyService.ts
│   ├── types/
│   │   └── property.ts
│   └── App.tsx
└── package.json
```

### Backend
```
backend/
├── src/
│   └── main/
│       ├── java/
│       │   └── com/propertymanager/
│       │       ├── config/
│       │       │   └── WebConfig.java
│       │       ├── controller/
│       │       │   ├── ImageController.java
│       │       │   └── PropertyController.java
│       │       ├── model/
│       │       │   ├── Image.java
│       │       │   └── Property.java
│       │       ├── repository/
│       │       │   ├── ImageRepository.java
│       │       │   └── PropertyRepository.java
│       │       └── service/
│       │           ├── ImageService.java
│       │           ├── ImageServiceImpl.java
│       │           ├── PropertyService.java
│       │           └── PropertyServiceImpl.java
│       └── resources/
│           └── application.properties
└── build.gradle
```

## API Endpoints

### Properties
- `GET /api/properties` - Get all properties
- `GET /api/properties/{id}` - Get property by ID
- `POST /api/properties` - Create new property
- `PUT /api/properties/{id}` - Update property
- `DELETE /api/properties/{id}` - Delete property

### Images
- `POST /api/images/upload/{propertyId}` - Upload images for a property
- `GET /api/images/{filename}` - Get image by filename
- `GET /api/images/property/{propertyId}` - Get all images for a property
- `DELETE /api/images/{id}` - Delete image

## Development

### Frontend Development
- Uses Vite for fast development and hot module replacement
- TypeScript for type safety
- Tailwind CSS for utility-first styling
- React Query for efficient data fetching and caching

### Backend Development
- Spring Boot with Gradle build system
- JPA/Hibernate for database operations
- Lombok for reducing boilerplate code
- File upload handling with proper error management
- CORS configuration for frontend communication

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
