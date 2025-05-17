package iuh.fit.userservice.config;

import iuh.fit.userservice.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collection;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String requestURI = request.getRequestURI();
        if (requestURI.equals("/api/users") || requestURI.equals("/api/users/login")) {
            chain.doFilter(request, response);
            return;
        }

        String authorizationHeader = request.getHeader("Authorization");

        String email = null;
        String jwt = null;
        String userId = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            try {
                email = jwtUtil.extractEmail(jwt);
                userId = jwtUtil.extractUserId(jwt);
                logger.debug("Extracted email: {}, userId: {} from token", email, userId);
            } catch (Exception e) {
                logger.error("Error extracting email or userId from token: {}", e.getMessage());
                chain.doFilter(request, response); // Cho phép tiếp tục nếu lỗi trích xuất
                return;
            }
        } else {
            logger.warn("No Authorization header or invalid format: {}", authorizationHeader);
        }

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                if (jwtUtil.validateToken(jwt, email)) {
                    String role = jwtUtil.extractRole(jwt);
                    if (userId == null) {
                        logger.warn("userId is null for email: {}, attempting to fetch from service", email);
                        // Có thể thêm logic để lấy userId từ UserService nếu cần
                    }
                    UserDetails userDetails = new CustomUserDetails(email, userId != null ? userId : "unknown", role);

                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    logger.info("Authenticated user: {} with role: {}, userId: {}", email, role, userId);
                } else {
                    logger.warn("Token validation failed for email: {}", email);
                }
            } catch (Exception e) {
                logger.error("Error validating token: {}", e.getMessage());
            }
        } else {
            logger.warn("No email extracted or authentication already set: email={}, auth={}", email, SecurityContextHolder.getContext().getAuthentication());
        }

        chain.doFilter(request, response);
    }
}

class CustomUserDetails implements UserDetails {
    private final String email;
    private final String userId;
    private final Collection<? extends GrantedAuthority> authorities;

    public CustomUserDetails(String email, String userId, String role) {
        this.email = email;
        this.userId = userId;
        this.authorities = Collections.singletonList(new SimpleGrantedAuthority(role));
    }

    public String getUserId() {
        return userId;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return null;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}