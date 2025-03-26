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

# Download dependencies with more logging
RUN ./gradlew dependencies --no-daemon --info

# Copy source code
COPY src src

# Build with more logging
RUN ./gradlew build -x test --no-daemon --info --stacktrace

EXPOSE 8081

CMD ["java", "-jar", "build/libs/property-manager-0.0.1-SNAPSHOT.jar"] 