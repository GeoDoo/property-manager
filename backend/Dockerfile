FROM openjdk:17-slim

WORKDIR /app

# Install curl for healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy Gradle files
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .

# Fix line endings and make gradlew executable
RUN sed -i 's/\r$//' gradlew && \
    chmod +x gradlew

# Download dependencies
RUN ./gradlew dependencies --no-daemon

EXPOSE 8081

CMD ["./gradlew", "bootRun", "--no-daemon"] 