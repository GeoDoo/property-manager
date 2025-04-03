# Property Manager

![Tests](https://github.com/GeoDoo/property-manager/actions/workflows/test.yml/badge.svg)
![Coverage](https://github.com/GeoDoo/property-manager/blob/main/.github/badges/jacoco.svg)
![Branches](https://github.com/GeoDoo/property-manager/blob/main/.github/badges/branches.svg)

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
   git clone https://github.com/GeoDoo/property-manager.git
   cd property-manager
   ```

2. Start the application using Docker Compose:
   ```