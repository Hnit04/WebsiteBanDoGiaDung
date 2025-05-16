package iuh.fit.paymentservice.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String NOTIFICATION_QUEUE = "notification-queue";
    private static final Logger logger = LoggerFactory.getLogger(RabbitMQConfig.class); // Sửa lại class logger

    @Bean
    public Queue notificationQueue() {
        logger.info("Creating notification queue: {}", NOTIFICATION_QUEUE);
        return new Queue(NOTIFICATION_QUEUE, false);
    }

    @Bean
    public Jackson2JsonMessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(jsonMessageConverter());

        // Bật chế độ xác nhận message
        rabbitTemplate.setConfirmCallback((correlationData, ack, cause) -> {
            if (!ack) {
                logger.error("Message không được gửi đến queue: {}", cause);
            } else {
                logger.info("Message đã được gửi thành công đến queue");
            }
        });

        // Xử lý khi message không thể định tuyến
        rabbitTemplate.setReturnsCallback(returned -> {
            logger.error("Message không thể định tuyến đến queue. ReplyCode: {}, ReplyText: {}",
                    returned.getReplyCode(), returned.getReplyText());
        });

        return rabbitTemplate;
    }
}