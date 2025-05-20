# Stage 1: Build JAR
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app
COPY build.gradle settings.gradle gradlew ./
COPY gradle/ gradle/
COPY src/ src/
RUN chmod +x gradlew && ./gradlew build -x test --no-daemon

# Stage 2: Run application
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY --from=builder /app/build/libs/PaymentService-0.0.1-SNAPSHOT.jar app.jar
COPY src/main/resources/application.yml .
EXPOSE 8085
CMD ["java", "-jar", "app.jar"]
