package iuh.fit.notificationservice.controller;

import iuh.fit.notificationservice.dto.request.CreateNotificationRequest;
import iuh.fit.notificationservice.dto.response.NotificationResponse;
import iuh.fit.notificationservice.service.NotificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping
    public ResponseEntity<NotificationResponse> createNotification(
            @RequestBody CreateNotificationRequest request) {
        log.info("Creating notification for user: {}", request.getUserId());
        NotificationResponse response = notificationService.createNotification(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationResponse>> getUserNotifications(
            @PathVariable String userId) {
        log.info("Fetching notifications for user: {}", userId);
        List<NotificationResponse> responses = notificationService.getNotificationsByUserId(userId);
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<NotificationResponse> markNotificationAsRead(
            @PathVariable String notificationId) {
        log.info("Marking notification as read: {}", notificationId);
        NotificationResponse response = notificationService.markAsRead(notificationId);
        return ResponseEntity.ok(response);
    }

}