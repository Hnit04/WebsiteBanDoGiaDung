# Stage 1: Build JAR
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app
COPY . .
RUN chmod +x gradlew
RUN ./gradlew build

# Stage 2: Run application
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY --from=builder /app/build/libs/CartService-0.0.1-SNAPSHOT.jar app.jar
COPY src/main/resources/application.yml .
ENV JAVA_OPTS="-Xmx256m -Xms128m"
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
EXPOSE ${PORT:-8084}
CMD ["java", "-jar", "/app/app.jar", "--server.port=$PORT"]