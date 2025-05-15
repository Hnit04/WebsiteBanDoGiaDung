package iuh.fit.userservice.config;

import iuh.fit.userservice.util.JwtUtil;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpMethod;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    private static final Logger logger = LoggerFactory.getLogger(SecurityConfig.class);

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/api/users/**").permitAll() // Cho phép OPTIONS cho tất cả endpoint /api/users
                        .requestMatchers("/api/users/login", "/api/users").permitAll() // Cho phép POST/GET cho đăng nhập và đăng ký
                        .requestMatchers("/api/users/**").hasAnyRole("ADMIN", "CUSTOMER") // Các endpoint khác yêu cầu quyền
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint((req, res, e) -> {
                            logger.error("Unauthorized error: {}", e.getMessage());
                            res.sendError(HttpServletResponse.SC_UNAUTHORIZED, e.getMessage());
                        })
                        .accessDeniedHandler((req, res, e) -> {
                            logger.error("Access denied: {}", e.getMessage());
                            res.sendError(HttpServletResponse.SC_FORBIDDEN, e.getMessage());
                        })
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}