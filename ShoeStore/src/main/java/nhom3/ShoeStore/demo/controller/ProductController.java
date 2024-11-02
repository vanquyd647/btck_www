package nhom3.ShoeStore.demo.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import nhom3.ShoeStore.demo.model.Product;
import nhom3.ShoeStore.demo.service.ProductService;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

	@Autowired
	private ProductService productService;

	private String getRoleFromSession(HttpSession session) {
		String role = (String) session.getAttribute("role");
		if (role == null) {
			role = "guest"; // Default role if not present in the session
		}
		return role;
	}

	@GetMapping
	public ResponseEntity<Map<String, Object>> getProducts(@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "30") int size) {
		Page<Product> productsPage = productService.getProductsByPage(page, size);

		Map<String, Object> response = new HashMap<>();
		response.put("products", productsPage.getContent());
		response.put("currentPage", page);
		response.put("totalPages", productsPage.getTotalPages());
		response.put("totalProducts", productsPage.getTotalElements());

		return ResponseEntity.ok(response);
	}

	@GetMapping("/{slug}")
	@ResponseBody
	public ResponseEntity<Map<String, Object>> getProductDetail(@PathVariable String slug, HttpSession session) {
		Map<String, Object> response = new HashMap<>();
		String role = getRoleFromSession(session);
		response.put("role", role);

		Product product = productService.getProductBySlug(slug);
		if (product != null) {
			response.put("product", product);
			return ResponseEntity.ok(response);
		} else {
			response.put("error", "Product not found");
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
		}
	}
}
