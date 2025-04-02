# Property Manager

A modern web application for managing property listings, built with React and Spring Boot. Features a clean, Rightmove-inspired design.

## Features

- **Property Listings**
  - View all properties in a responsive grid layout
  - Property cards with image previews and key information
  - Rightmove-style property statistics display

- **Property Details**
  - Image slider for property photos
  - Key property statistics (bedrooms, bathrooms, size in sq ft/m)
  - Detailed property description
  - Price and address information

- **Property Management**
  - Add new properties
  - Edit existing properties
  - Delete properties
  - Upload and manage multiple property images
  - Delete individual images

## Tech Stack

### Frontend
- React with TypeScript
- TailwindCSS for styling
- React Query for data fetching
- React Router for navigation
- React Icons for UI icons

### Backend
- Spring Boot
- JPA/Hibernate
- PostgreSQL database
- RESTful API architecture

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Java 17 or higher
- PostgreSQL

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Frontend setup:
```bash
cd frontend
npm install
```

3. Backend setup:
```bash
cd backend
./mvnw clean install
```

4. Configure the database:
- Create a PostgreSQL database
- Update `application.properties` with your database credentials

### Running the Application

1. Start the backend server:
```bash
cd backend
./mvnw spring-boot:run
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`

## API Endpoints

### Properties
- `GET /api/properties` - Get all properties
- `GET /api/properties/{id}` - Get property by ID
- `POST /api/properties` - Create new property
- `PUT /api/properties/{id}` - Update property
- `DELETE /api/properties/{id}` - Delete property

### Images
- `POST /api/images/upload/{propertyId}` - Upload property images
- `GET /api/images/property/{propertyId}` - Get property images
- `DELETE /api/images/{id}` - Delete image

## Styling

The application uses TailwindCSS with a custom theme inspired by Rightmove:
- Primary color: #00deb6 (Rightmove teal)
- Text colors: 
  - Primary: #262637 (dark navy)
  - Secondary: #666666 (medium gray)
  - Labels: #6a6a6a (light gray)
- Clean, modern UI with consistent spacing and typography
- Responsive design that works on all screen sizes

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
