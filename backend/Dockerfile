FROM openjdk:17-slim

WORKDIR /app

# Copy Gradle files first for better caching
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .

# Fix line endings and make gradlew executable
RUN sed -i 's/\r$//' gradlew && \
    chmod +x gradlew

# Download dependencies
RUN ./gradlew dependencies --no-daemon

# Copy source code
COPY src src

# Build the application
RUN ./gradlew build -x test --no-daemon

EXPOSE 8081

CMD ["java", "-jar", "build/libs/*.jar"] 