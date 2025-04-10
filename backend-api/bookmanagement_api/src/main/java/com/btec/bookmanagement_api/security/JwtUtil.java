package com.btec.bookmanagement_api.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.stereotype.Component;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
@Component
public class JwtUtil {
    private static final String SECRET_KEY = "Akjhsdfjkhsdfhsadhjaskdhasjkhdkjsahdjkashdjkashdjksahdjksadhsakjh"; // Use a secure key
    private static final long EXPIRATION_TIME = 86400000; // 1 day in milliseconds
    private static final Key SIGNING_KEY = Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));

    /**
     * Generate a JWT token for a given email.
     *
     * @param email The user's email.
     * @return The JWT token.
     */


    public static String generateToken(String email, String role) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)  // Thêm role vào token
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    public static String extractEmail(String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(SECRET_KEY)
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        } catch (ExpiredJwtException e) {
            throw new RuntimeException("Token đã hết hạn!");
        } catch (SignatureException e) {
            throw new RuntimeException("Chữ ký JWT không hợp lệ!");
        } catch (Exception e) {
            throw new RuntimeException("Token không hợp lệ!");
        }
    }
    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SIGNING_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public static boolean verifyToken(String token) throws Exception {
        try {
            Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token);
            return true;
        } catch (SignatureException e) {
            throw new Exception("Invalid JWT signature");
        } catch (ExpiredJwtException e) {
            throw new Exception("JWT token is expired");
        } catch (Exception e) {
            throw new Exception("Invalid JWT token");
        }
    }



    // Existing methods for validation and claims extraction
}
