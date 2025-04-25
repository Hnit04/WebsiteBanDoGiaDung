package iuh.fit.userservice;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.RabbitMQContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

@SpringBootTest
@Testcontainers
class UserServiceApplicationTests {

    @Container
    private static final GenericContainer<?> mongoContainer = new GenericContainer<>(DockerImageName.parse("mongo:4.4.6"))
            .withExposedPorts(27017);

    @Container
    private static final RabbitMQContainer rabbitMQContainer = new RabbitMQContainer(DockerImageName.parse("rabbitmq:3.9"));

    @DynamicPropertySource
    static void setProperties(DynamicPropertyRegistry registry) {
        // Cấu hình MongoDB URI
        String mongoUri = "mongodb://" + mongoContainer.getHost() + ":" + mongoContainer.getFirstMappedPort() + "/userdb";
        registry.add("spring.data.mongodb.uri", () -> mongoUri);

        // Cấu hình RabbitMQ
        registry.add("spring.rabbitmq.host", rabbitMQContainer::getHost);
        registry.add("spring.rabbitmq.port", rabbitMQContainer::getAmqpPort);
        registry.add("spring.rabbitmq.username", rabbitMQContainer::getAdminUsername);
        registry.add("spring.rabbitmq.password", rabbitMQContainer::getAdminPassword);
    }

    @Test
    void contextLoads() {
    }
}