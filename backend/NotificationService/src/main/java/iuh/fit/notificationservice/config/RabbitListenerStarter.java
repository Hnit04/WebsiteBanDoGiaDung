package iuh.fit.notificationservice.config;

import org.springframework.amqp.rabbit.listener.RabbitListenerEndpointRegistry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class RabbitListenerStarter {
    @Autowired
    private RabbitListenerEndpointRegistry registry;
    @EventListener(ApplicationReadyEvent.class)
    public void startRabbitListeners() {
        System.out.println("🔥 RabbitListenerEndpointRegistry STARTING...");
        registry.start();
    }


}