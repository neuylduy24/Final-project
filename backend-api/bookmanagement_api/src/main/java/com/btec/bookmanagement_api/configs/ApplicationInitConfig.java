package com.btec.bookmanagement_api.configs;

import com.btec.bookmanagement_api.entities.User;
import com.btec.bookmanagement_api.enums.Role;
import com.btec.bookmanagement_api.repositories.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.time.LocalDateTime;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ApplicationInitConfig {

    PasswordEncoder passwordEncoder;

    @Bean
    ApplicationRunner applicationRunner(UserRepository userRepository) {
        return args -> {
            userRepository.findByEmail("admin@gmail.com").ifPresentOrElse(
                    admin -> {
                        // Nếu admin đã tồn tại nhưng chưa được xác thực, cập nhật lại
                        if (!admin.isVerified()) {
                            admin.setVerified(true);
                            admin.setEnabled(true);
                            admin.setVerificationToken(null); // Xóa token
                            admin.setTokenExpiry(null); // Xóa thời gian hết hạn token
                            userRepository.save(admin);
                            log.info("Admin email has been verified.");
                        }
                    },
                    () -> {
                        // Nếu chưa có admin, tạo mới với email đã xác thực
                        var roles = new HashSet<String>();
                        roles.add(Role.ADMIN.name());

                        User user = User.builder()
                                .email("admin@gmail.com")
                                .password(passwordEncoder.encode("admin"))
                                .username("Admin")
                                .roles(roles)
                                .avatar("default_avatar.png")
                                .enabled(true) // Kích hoạt tài khoản
                                .isVerified(true) // Xác thực email
                                .verificationToken(null) // Không cần token
                                .tokenExpiry(null)
                                .createdAt(LocalDateTime.now())
                                .build();

                        userRepository.save(user);
                        log.warn("Admin user has been created with default password: admin, please change it.");
                    }
            );
        };
    }
}
