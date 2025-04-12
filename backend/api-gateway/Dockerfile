FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

COPY build/libs/api-gateway-0.0.1-SNAPSHOT.jar app.jar

COPY src/main/resources/application.yml .

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
