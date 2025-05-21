//package iuh.fit.cartservice.config;
//
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.amqp.core.Queue;
//import org.springframework.amqp.rabbit.connection.ConnectionFactory;
//import org.springframework.amqp.rabbit.core.RabbitTemplate;
//import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.client.RestTemplate;
//
//@Configuration
//public class RabbitMQConfig {
//
//    public static final String CART_QUEUE = "cart-queue";
//    private static final Logger logger = LoggerFactory.getLogger(RabbitMQConfig.class);
//
//    @Bean
//    public Queue cartQueue() {
//        logger.info("Creating cart queue: {}", CART_QUEUE);
//        return new Queue(CART_QUEUE, false);
//    }
//
//    @Bean
//    public Jackson2JsonMessageConverter jsonMessageConverter() {
//        return new Jackson2JsonMessageConverter();
//    }
//
//    @Bean
//    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
//        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
//        rabbitTemplate.setMessageConverter(jsonMessageConverter());
//
//        rabbitTemplate.setConfirmCallback((correlationData, ack, cause) -> {
//            if (!ack) {
//                logger.error("Cart message failed to reach queue: {}", cause);
//            } else {
//                logger.info("Cart message delivered to queue");
//            }
//        });
//
//        rabbitTemplate.setReturnsCallback(returned -> {
//            logger.error("Cart message undeliverable. ReplyCode: {}, ReplyText: {}",
//                    returned.getReplyCode(), returned.getReplyText());
//        });
//
//        return rabbitTemplate;
//    }
//
//    @Bean
//    public RestTemplate restTemplate() { // Thêm RestTemplate
//        return new RestTemplate();
//    }
//}