package iuh.fit.notificationservice.mapper;

import iuh.fit.notificationservice.dto.response.NotificationResponse;
import iuh.fit.notificationservice.model.Notification;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class NotificationMapper {

    public NotificationResponse toNotificationResponse(Notification notification) {
        NotificationResponse response = new NotificationResponse();
        response.setNotificationId(notification.getNotificationId());
        response.setUserId(notification.getUserId());
        response.setMessage(notification.getMessage());
        response.setType(notification.getType());
        response.setCreatedDate(notification.getCreatedDate());
        response.setRead(notification.isRead());
        return response;
    }

    public List<NotificationResponse> toNotificationResponseList(List<Notification> notifications) {
        return notifications.stream()
                .map(this::toNotificationResponse)
                .collect(Collectors.toList());
    }
}