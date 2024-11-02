package nhom3.ShoeStore.demo.service;

import nhom3.ShoeStore.demo.model.User;
import nhom3.ShoeStore.demo.repository.UserRepository;
import nhom3.ShoeStore.demo.security.JwtTokenUtil;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Autowired
	private JwtTokenUtil jwtTokenUtil;

	public User saveUser(User user) {
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		return userRepository.save(user);
	}

	public User findByUsername(String username) {
		return userRepository.findByUsername(username).orElse(null);
	}

	public Page<User> getAllUsers(Pageable pageable) {
		return userRepository.findAll(pageable); // Ensure this returns Page<User>
	}

	public User getUserById(Long id) {
		Optional<User> user = userRepository.findById(id);
		return user.orElse(null);
	}

	public User getUserByUsername(String username) {
		Optional<User> userOptional = userRepository.findByUsername(username);
		return userOptional.orElse(null); // Trả về null nếu không tìm thấy user
	}

	public void deleteUserById(Long id) {
		// Fetch the user by ID
		User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

		// Check if the user has a "superadmin" role
		if ("superadmin".equalsIgnoreCase(user.getRole().getName())) {
			throw new IllegalArgumentException("Cannot delete user with superadmin role");
		}

		// Proceed to delete if the user is not a superadmin
		userRepository.deleteById(id);
	}
	
	public String generateUserToken(String username) {
        User user = findByUsername(username);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        return jwtTokenUtil.generateToken(user);
    }

}
