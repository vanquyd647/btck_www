package nhom3.ShoeStore.demo.repository;


import nhom3.ShoeStore.demo.model.User;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    
    Page<User> findAll(Pageable pageable);
}
