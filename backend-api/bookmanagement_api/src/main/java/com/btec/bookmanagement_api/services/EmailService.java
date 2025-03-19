package com.btec.bookmanagement_api.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public boolean sendVerificationEmail(String email, String token) {
        try {
            String url = "https://api.it-ebook.io.vn/api/auth/verify?token=" + token;
            String subject = "Xác minh tài khoản của bạn";
            String message = "Vui lòng nhấp vào link dưới đây để xác minh tài khoản của bạn:\n" + url;

            SimpleMailMessage emailMessage = new SimpleMailMessage();
            emailMessage.setTo(email);
            emailMessage.setSubject(subject);
            emailMessage.setText(message);
            emailMessage.setFrom("your-email@gmail.com");  // Đổi thành email của bạn

            mailSender.send(emailMessage);
            System.out.println("✅ Email xác minh đã gửi thành công tới: " + email);
            return true;
        } catch (MailException e) {
            System.err.println("❌ Lỗi gửi email: " + e.getMessage());
            return false;
        }
    }

    public void sendResetPasswordCode(String email, String otp) {
        try {
            String subject = "🔐 Mã OTP Đặt Lại Mật Khẩu";
            String message = "Mã OTP của bạn là: " + otp + ". OTP có hiệu lực trong 5 phút.";

            SimpleMailMessage emailMessage = new SimpleMailMessage();
            emailMessage.setTo(email);
            emailMessage.setSubject(subject);
            emailMessage.setText(message);
            emailMessage.setFrom("dieptvbh00666@fpt.edu.vn");  // Đảm bảo đây là email của bạn

            mailSender.send(emailMessage);
            System.out.println("✅ Email OTP đã được gửi thành công!");
        } catch (MailException e) {
            System.err.println("❌ Lỗi gửi email: " + e.getMessage());
            throw new RuntimeException("Lỗi khi gửi email OTP.");
        }
    }

}
