package nhom3.ShoeStore.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.Random;

@Component
public class SendOtpController {

    @Autowired
    private JavaMailSender mailSender;

    public String generateOtp() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(999999));
    }

    @Async
    public void sendOtpAsync(String recipientEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("homequy001@gmail.com"); // Your email
        message.setTo(recipientEmail);
        message.setSubject("Your OTP Code");
        message.setText("Your OTP code is: " + otp);

        try {
            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public String sendOtp(String recipientEmail) {
        String otp = generateOtp();  // Generate OTP

        // Send OTP asynchronously
        sendOtpAsync(recipientEmail, otp);

        return otp;  // Return OTP for verification
    }
}
