FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

COPY build/libs/NotificationService-0.0.1-SNAPSHOT.jar app.jar

COPY src/main/resources/application.yml .

EXPOSE 8089

ENV JAVA_OPTS="-Xmx256m -Xms128m"
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
