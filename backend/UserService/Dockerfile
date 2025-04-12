# Sử dụng JDK 21 nhẹ
FROM eclipse-temurin:21-jdk-alpine

# Tạo thư mục làm việc trong container
WORKDIR /app

# Copy file jar đã build từ Gradle
COPY build/libs/UserService-0.0.1-SNAPSHOT.jar app.jar

COPY src/main/resources/application.yml .

# Mở cổng 8082
EXPOSE 8082

# Lệnh chạy app
ENTRYPOINT ["java", "-jar", "app.jar"]
