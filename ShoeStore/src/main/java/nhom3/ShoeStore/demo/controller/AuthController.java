
package nhom3.ShoeStore.demo.controller;

import nhom3.ShoeStore.demo.dto.UserDto;
import nhom3.ShoeStore.demo.model.Role;
import nhom3.ShoeStore.demo.model.User;
import nhom3.ShoeStore.demo.model.VerifyOtpRequest;
import nhom3.ShoeStore.demo.security.JwtTokenUtil;
import nhom3.ShoeStore.demo.service.RoleService;
import nhom3.ShoeStore.demo.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

	@Autowired
	private UserService userService;

	@Autowired
	private RoleService roleService;

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private JwtTokenUtil jwtTokenUtil;

	@Autowired
	private SendOtpController sendOtpController;

	@PostMapping("/register")
	public ResponseEntity<?> registerUser(@RequestBody User user) {
		try {
			Role customerRole = roleService.findByName("customer");
			if (customerRole == null) {
				throw new RuntimeException("Role 'customer' not found.");
			}

			user.setRole(customerRole);
			String otp = sendOtpController.sendOtp(user.getEmail());

			// Chuyển đổi User sang UserDto
			UserDto userDto = new UserDto(user.getId(), user.getUsername(), user.getPassword(), user.getEmail(),
					user.getPhone(), user.getAddress(), user.getRole().getName());

			Map<String, Object> responseBody = new HashMap<>();
			responseBody.put("otp", otp);
			responseBody.put("user", userDto);
			responseBody.put("message", "OTP sent to your email! Please verify it.");

			return ResponseEntity.ok(responseBody);
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(new ResponseMessage(e.getMessage()));
		}
	}

	@PostMapping("/verify-otp")
	public ResponseEntity<?> verifyOtp(@RequestBody VerifyOtpRequest request) {
		String otp = request.getOtp();
		UserDto userDto = request.getUser();

		// Chuyển đổi từ UserDto sang User
		User user = convertUserDtoToUser(userDto);

		// Kiểm tra vai trò của người dùng
		if (user.getRole() == null) {
			return ResponseEntity.badRequest().body(Collections.singletonMap("message", "User role is missing."));
		}

		// Kiểm tra OTP
		boolean isOtpValid = validateOtp(otp, user);
		if (!isOtpValid) {
			return ResponseEntity.badRequest().body(Collections.singletonMap("message", "Invalid OTP."));
		}

		// Lưu thông tin người dùng vào cơ sở dữ liệu sau khi OTP hợp lệ
		userService.saveUser(user);

		return ResponseEntity.ok(Collections.singletonMap("message", "OTP verified successfully."));
	}

	private User convertUserDtoToUser(UserDto userDto) {
		User user = new User();
		user.setEmail(userDto.getEmail());
		user.setPassword(userDto.getPassword());
		user.setUsername(userDto.getUsername());
		user.setPhone(userDto.getPhone());
		user.setAddress(userDto.getAddress());

		// Thiết lập role từ tên role trong UserDto
		Role role = roleService.findByName(userDto.getRoleName());
		if (role == null) {
			throw new RuntimeException("Role '" + userDto.getRoleName() + "' not found.");
		}
		user.setRole(role);

		return user;
	}

	private boolean validateOtp(String otp, User user) {
		// Logic để kiểm tra OTP ở đây (chẳng hạn so sánh với OTP đã lưu trữ)
		return true; // Thay thế bằng logic thực tế
	}

	// Class ResponseMessage to create response
	public class ResponseMessage {
		private String message;

		public ResponseMessage(String message) {
			this.message = message;
		}

		public String getMessage() {
			return message;
		}
	}

	// Class to represent OTP request payload
	public static class OtpRequest {
		private String otp;

		public String getOtp() {
			return otp;
		}

		public void setOtp(String otp) {
			this.otp = otp;
		}
	}

	// Endpoint to login user
	@PostMapping("/login")
	public ResponseEntity<?> loginUser(@RequestParam String username, @RequestParam String password) {
	    try {
	        // Authenticate user
	        Authentication authentication = authenticationManager
	                .authenticate(new UsernamePasswordAuthenticationToken(username, password));

	        // Set authentication information in SecurityContext
	        SecurityContextHolder.getContext().setAuthentication(authentication);

	        // Fetch user details from database
	        User user = userService.findByUsername(username);
	        if (user == null) {
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
	                    .body(Collections.singletonMap("error", "User not found"));
	        }

	        // Generate JWT token with user details
	        String token = jwtTokenUtil.generateToken(user);

	        // Prepare response with token and role
	        Map<String, Object> responseBody = new HashMap<>();
	        responseBody.put("token", token);
	        responseBody.put("role", user.getRole().getName());

	        return ResponseEntity.ok(responseBody);
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
	                .body(Collections.singletonMap("error", "Invalid username or password"));
	    }
	}


	@PostMapping("/logout")
	public ResponseEntity<?> logout() {
		// Clear authentication information
		SecurityContextHolder.clearContext();
		return ResponseEntity.ok().body(new ResponseMessage("Logout successful!"));
	}

//	@PostMapping("/register")
//	public ResponseEntity<?> registerUser(@RequestBody User user) {
//		try {
//			// Lấy vai trò 'customer' từ bảng roles
//			Role customerRole = roleService.findByName("customer");
//
//			if (customerRole == null) {
//				throw new RuntimeException("Role 'customer' not found.");
//			}
//
//			user.setRole(customerRole); // Thiết lập vai trò cho người dùng
//			userService.saveUser(user);
//
//			// Trả về phản hồi thành công
//			return ResponseEntity.ok().body(new ResponseMessage("Registration successful!"));
//		} catch (RuntimeException e) {
//			// Trả về phản hồi lỗi
//			return ResponseEntity.badRequest().body(new ResponseMessage(e.getMessage()));
//		}
//	}
}
