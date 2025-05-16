package iuh.fit.userservice.service;

import iuh.fit.userservice.config.RabbitMQConfig;
import iuh.fit.userservice.dto.NotificationMessage;
import iuh.fit.userservice.dto.request.CreateUserRequest;
import iuh.fit.userservice.dto.response.UserResponse;
import iuh.fit.userservice.mapper.UserMapper;
import iuh.fit.userservice.model.Role;
import iuh.fit.userservice.model.User;
import iuh.fit.userservice.repository.UserRepository;
import iuh.fit.userservice.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.MessageDeliveryMode;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final RabbitTemplate rabbitTemplate;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserService(UserRepository userRepository,
                       UserMapper userMapper,
                       RabbitTemplate rabbitTemplate,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.rabbitTemplate = rabbitTemplate;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public Map<String, Object> createUser(CreateUserRequest request) {
        logger.info("Creating user with email: {}", request.getEmail());

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            logger.warn("Email already exists: {}", request.getEmail());
            throw new IllegalArgumentException("Email already exists");
        }

        validatePassword(request.getPassword());

        try {
            User user = new User();
            user.setUsername(request.getUsername());
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setPhone(request.getPhone());
            user.setAddress(request.getAddress());

            if (request.getRole() != null) {
                user.setRole(Role.valueOf(request.getRole()));
            } else {
                user.setRole(Role.CUSTOMER); // Mặc định là CUSTOMER
            }

            User savedUser = userRepository.save(user);
            logger.info("User created successfully with ID: {}", savedUser.getUserId());

            // Chuyển đổi role thành ROLE_ADMIN hoặc ROLE_CUSTOMER cho token
            String tokenRole = "ROLE_" + savedUser.getRole().name();
            String token = jwtUtil.generateToken(savedUser.getEmail(), tokenRole, savedUser.getUserId());

            Map<String, Object> response = new HashMap<>();
            response.put("user", userMapper.toUserResponse(savedUser));
            response.put("token", token);

            sendWelcomeNotification(savedUser);
            return response;
        } catch (org.springframework.dao.DuplicateKeyException e) {
            logger.warn("Email already exists: {}", request.getEmail());
            throw new IllegalArgumentException("Email already exists");
        } catch (IllegalArgumentException e) {
            logger.warn("Invalid role value: {}", request.getRole());
            throw new IllegalArgumentException("Role must be either CUSTOMER or ADMIN");
        }
    }

    public UserResponse getUserById(String userId) {
        logger.debug("Fetching user by ID: {}", userId);
        return userRepository.findById(userId)
                .map(userMapper::toUserResponse)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<UserResponse> getAllUsers() {
        logger.debug("Fetching all users");
        return userRepository.findAll()
                .stream()
                .map(userMapper::toUserResponse)
                .toList();
    }

    @Transactional
    public UserResponse updateUser(String userId, CreateUserRequest request) {
        logger.info("Updating user with ID: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getUsername() != null) {
            user.setUsername(request.getUsername());
        }
        if (request.getPassword() != null) {
            validatePassword(request.getPassword());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }
        if (request.getRole() != null) {
            try {
                user.setRole(Role.valueOf(request.getRole()));
            } catch (IllegalArgumentException e) {
                logger.warn("Invalid role value: {}", request.getRole());
                throw new IllegalArgumentException("Role must be either CUSTOMER or ADMIN");
            }
        }

        User updatedUser = userRepository.save(user);
        logger.info("User updated successfully: {}", userId);

        return userMapper.toUserResponse(updatedUser);
    }

    @Transactional
    public void deleteUser(String userId) {
        logger.info("Deleting user with ID: {}", userId);
        if (userRepository.existsById(userId)) {
            userRepository.deleteById(userId);
            logger.info("User deleted successfully: {}", userId);
        } else {
            logger.warn("User not found for deletion: {}", userId);
            throw new RuntimeException("User not found");
        }
    }

    private void sendWelcomeNotification(User user) {
        try {
            NotificationMessage message = new NotificationMessage();
            message.setUserId(user.getUserId());
            message.setMessage("Welcome " + user.getUsername() + " to our service!");
            message.setType("WELCOME_MESSAGE");

            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.NOTIFICATION_EXCHANGE,
                    RabbitMQConfig.NOTIFICATION_ROUTING_KEY,
                    message,
                    m -> {
                        m.getMessageProperties().setDeliveryMode(MessageDeliveryMode.PERSISTENT);
                        return m;
                    }
            );
            logger.info("Sent welcome notification for user: {}", user.getUserId());
        } catch (Exception e) {
            logger.error("Failed to send welcome notification: {}", e.getMessage());
        }
    }

    public Map<String, Object> login(String email, String password) {
        logger.info("Attempting login for email: {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    logger.warn("Email not found: {}", email);
                    return new RuntimeException("Invalid email or password");
                });

        if (!passwordEncoder.matches(password, user.getPassword())) {
            logger.warn("Invalid password for email: {}", email);
            throw new RuntimeException("Invalid email or password");
        }

        String tokenRole = "ROLE_" + user.getRole().name();
        String token = jwtUtil.generateToken(user.getEmail(), tokenRole, user.getUserId());
        Map<String, Object> response = new HashMap<>();
        response.put("user", userMapper.toUserResponse(user));
        response.put("token", token);

        logger.info("Login successful for email: {}", email);
        return response;
    }

    private void validatePassword(String password) {
        String passwordPattern = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$";
        if (!password.matches(passwordPattern)) {
            throw new IllegalArgumentException("Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
        }
    }
}