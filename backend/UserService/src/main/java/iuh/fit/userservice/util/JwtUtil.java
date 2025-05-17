package iuh.fit.userservice.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtUtil {

    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expirationTime; // Sử dụng giá trị từ application.yml

    private Key getSigningKey() {
        logger.debug("Decoding secret key: {}", secret);
        byte[] keyBytes = Base64.getDecoder().decode(secret);
        logger.debug("Secret key length: {} bytes", keyBytes.length);
        return new SecretKeySpec(keyBytes, SignatureAlgorithm.HS256.getJcaName());
    }

    public String generateToken(String email, String role, String userId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationTime);

        logger.info("Generating token for email: {}, issued at: {}, expires at: {}",
                email, now, expiryDate);

        if (expiryDate.before(now)) {
            throw new IllegalStateException("Expiry date is before issued date: " + expiryDate + " < " + now);
        }

        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .claim("userId", userId)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractEmail(String token) {
        return getClaims(token).getSubject();
    }

    public String extractUserId(String token) {
        return getClaims(token).get("userId", String.class);
    }

    public String extractRole(String token) {
        return getClaims(token).get("role", String.class);
    }

    public boolean validateToken(String token, String email) {
        final String extractedEmail = extractEmail(token);
        boolean isValid = extractedEmail.equals(email) && !isTokenExpired(token);
        if (!isValid) {
            logger.warn("Token validation failed for email: {}. Expired: {}", email, isTokenExpired(token));
        }
        return isValid;
    }

    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private boolean isTokenExpired(String token) {
        boolean expired = getClaims(token).getExpiration().before(new Date());
        if (expired) {
            logger.info("Token expired. Expiration: {}", getClaims(token).getExpiration());
        }
        return expired;
    }
}