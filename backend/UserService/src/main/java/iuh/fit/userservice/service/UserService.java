package iuh.fit.userservice.service;

import iuh.fit.userservice.config.RabbitMQConfig;
import iuh.fit.userservice.dto.NotificationMessage;
import iuh.fit.userservice.dto.request.CreateUserRequest;
import iuh.fit.userservice.dto.response.UserResponse;
import iuh.fit.userservice.mapper.UserMapper;
import iuh.fit.userservice.model.Role;
import iuh.fit.userservice.model.User;
import iuh.fit.userservice.model.VerificationCode;
import iuh.fit.userservice.repository.UserRepository;
import iuh.fit.userservice.repository.VerificationCodeRepository;
import iuh.fit.userservice.util.JwtUtil;
import jakarta.mail.internet.MimeMessage;
import org.apache.commons.text.StringEscapeUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.MessageDeliveryMode;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final VerificationCodeRepository verificationCodeRepository;
    private final UserMapper userMapper;
    private final RabbitTemplate rabbitTemplate;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final JavaMailSender mailSender;

    public UserService(UserRepository userRepository,
                       VerificationCodeRepository verificationCodeRepository,
                       UserMapper userMapper,
                       RabbitTemplate rabbitTemplate,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil,
                       JavaMailSender mailSender) {
        this.userRepository = userRepository;
        this.verificationCodeRepository = verificationCodeRepository;
        this.userMapper = userMapper;
        this.rabbitTemplate = rabbitTemplate;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.mailSender = mailSender;
    }

    @Transactional
    public Map<String, Object> createUser(CreateUserRequest request) {
        logger.info("Processing user creation request for email: {}", request.getEmail());

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            logger.warn("Email already exists: {}", request.getEmail());
            throw new IllegalArgumentException("Email already exists");
        }

        validatePassword(request.getPassword());

        String verificationCode = String.format("%06d", new Random().nextInt(999999));
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiresAt = now.plusMinutes(10);

        verificationCodeRepository.deleteByEmail(request.getEmail());
        VerificationCode code = new VerificationCode(request.getEmail(), verificationCode, now, expiresAt);
        verificationCodeRepository.save(code);

        sendVerificationEmail(request.getEmail(), verificationCode, "register");

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Verification code sent to " + request.getEmail());
        response.put("email", request.getEmail());
        return response;
    }

    @Transactional
    public Map<String, Object> verifyCodeAndCreateUser(String email, String code, CreateUserRequest request) {
        logger.info("Verifying code for email: {}", email);

        VerificationCode verificationCode = verificationCodeRepository.findByEmailAndCode(email, code)
                .orElseThrow(() -> {
                    logger.warn("Invalid or expired verification code for email: {}", email);
                    return new IllegalArgumentException("Invalid or expired verification code");
                });

        if (verificationCode.getExpiresAt().isBefore(LocalDateTime.now())) {
            verificationCodeRepository.deleteByEmail(email);
            logger.warn("Verification code expired for email: {}", email);
            throw new IllegalArgumentException("Verification code expired");
        }

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
                user.setRole(Role.CUSTOMER);
            }

            User savedUser = userRepository.save(user);
            logger.info("User created successfully with ID: {}", savedUser.getUserId());

            String tokenRole = "ROLE_" + savedUser.getRole().name();
            String token = jwtUtil.generateToken(savedUser.getEmail(), tokenRole, savedUser.getUserId());

            Map<String, Object> response = new HashMap<>();
            response.put("user", userMapper.toUserResponse(savedUser));
            response.put("token", token);

            verificationCodeRepository.deleteByEmail(email);

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

    @Transactional
    public Map<String, Object> forgotPassword(String email) {
        logger.info("Processing forgot password request for email: {}", email);

        if (!userRepository.findByEmail(email).isPresent()) {
            logger.warn("Email not found: {}", email);
            throw new IllegalArgumentException("Email not found");
        }

        String verificationCode = String.format("%06d", new Random().nextInt(999999));
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiresAt = now.plusMinutes(10);

        verificationCodeRepository.deleteByEmail(email);
        VerificationCode code = new VerificationCode(email, verificationCode, now, expiresAt);
        verificationCodeRepository.save(code);

        sendVerificationEmail(email, verificationCode, "forgot-password");

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Verification code sent to " + email);
        response.put("email", email);
        return response;
    }

    @Transactional
    public Map<String, Object> resetPassword(String email, String code, String newPassword) {
        logger.info("Resetting password for email: {}", email);

        VerificationCode verificationCode = verificationCodeRepository.findByEmailAndCode(email, code)
                .orElseThrow(() -> {
                    logger.warn("Invalid or expired verification code for email: {}", email);
                    return new IllegalArgumentException("Invalid or expired verification code");
                });

        if (verificationCode.getExpiresAt().isBefore(LocalDateTime.now())) {
            verificationCodeRepository.deleteByEmail(email);
            logger.warn("Verification code expired for email: {}", email);
            throw new IllegalArgumentException("Verification code expired");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    logger.warn("Email not found: {}", email);
                    return new IllegalArgumentException("Email not found");
                });

        validatePassword(newPassword);
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        verificationCodeRepository.deleteByEmail(email);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Password reset successfully");
        return response;
    }

    private void sendVerificationEmail(String email, String code, String type) {
        try {
            if (email == null || email.contains("\"") || code == null || code.contains("\"")) {
                logger.error("Invalid email or code: email={}, code={}", email, code);
                throw new IllegalArgumentException("Invalid email or code");
            }

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setFrom("trancongtinh20042004@gmail.com", "Bán Đồ Gia Dụng");
            helper.setTo(email);
            helper.setReplyTo("trancongtinh20042004@gmail.com");

            String subject = type.equals("register") ? "Xác nhận đăng ký tài khoản" : "Đặt lại mật khẩu";
            helper.setSubject(subject);

            String safeCode = StringEscapeUtils.escapeHtml4(code);
            String htmlContent = type.equals("register") ?
                    """
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0;">
                        <h2 style="color: #333;">Bán Đồ Gia Dụng</h2>
                        <h3 style="color: #555;">Xác nhận đăng ký tài khoản</h3>
                        <p>Cảm ơn bạn đã đăng ký tài khoản tại Bán Đồ Gia Dụng.</p>
                        <p>Mã xác nhận của bạn là:</p>
                        <h2 style="color: #007bff;">%s</h2>
                        <p>Vui lòng nhập mã này để hoàn tất đăng ký. Mã có hiệu lực trong 10 phút.</p>
                        <p>Nếu bạn không thực hiện đăng ký, vui lòng bỏ qua email này.<br>
                           Liên hệ hỗ trợ qua <a href="mailto:trancongtinh20042004@gmail.com">trancongtinh20042004@gmail.com</a>.</p>
                        <p style="color: #777; font-size: 12px;">© 2025 Bán Đồ Gia Dụng. All rights reserved.</p>
                    </div>
                    """.formatted(safeCode) :
                    """
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0;">
                        <h2 style="color: #333;">Bán Đồ Gia Dụng</h2>
                        <h3 style="color: #555;">Đặt lại mật khẩu</h3>
                        <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
                        <p>Mã xác nhận của bạn là:</p>
                        <h2 style="color: #007bff;">%s</h2>
                        <p>Vui lòng nhập mã này để đặt lại mật khẩu. Mã có hiệu lực trong 10 phút.</p>
                        <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.<br>
                           Liên hệ hỗ trợ qua <a href="mailto:trancongtinh20042004@gmail.com">trancongtinh20042004@gmail.com</a>.</p>
                        <p style="color: #777; font-size: 12px;">© 2025 Bán Đồ Gia Dụng. All rights reserved.</p>
                    </div>
                    """.formatted(safeCode);

            helper.setText(htmlContent, true);
            mailSender.send(mimeMessage);
            logger.info("Verification email sent to: {} for {}", email, type);
        } catch (Exception e) {
            logger.error("Failed to send verification email to {}: {}", email, e.getMessage(), e);
            throw new RuntimeException("Failed to send verification email", e);
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