package nhom3.ShoeStore.demo.controller;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Pageable;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpSession;
import nhom3.ShoeStore.demo.model.Product;
import nhom3.ShoeStore.demo.model.ProductListResponse;
import nhom3.ShoeStore.demo.model.ProductWrapper;
import nhom3.ShoeStore.demo.model.User;
import nhom3.ShoeStore.demo.service.ProductService;
import nhom3.ShoeStore.demo.service.UserService;

import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

	@Autowired
	private ProductService productService;
	@Autowired
	private UserService userService;

	private String getRoleFromSession(HttpSession session) {
		String role = (String) session.getAttribute("role");
		if (role == null) {
			role = "guest"; // Default role if not present in the session
		}
		return role;
	}

	@GetMapping("/products/show")
	public ResponseEntity<List<Product>> listAllProducts() {
		try {
			// Fetch all products without pagination
			List<Product> products = productService.getAllProducts();

			// Return the response with the product list directly
			return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(products);
		} catch (Exception e) {
			// In case of error, return an internal server error status
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	@GetMapping("/products")
	public ResponseEntity<ProductListResponse> listAllProducts(
	        @RequestParam int page,
	        @RequestParam int size,
	        @RequestParam(defaultValue = "name") String sortField,
	        @RequestParam(defaultValue = "asc") String sortOrder) {

	    List<String> allowedSortFields = Arrays.asList("shoe_id", "name", "price", "quantity", "brand", "createdAt");

	    if (!allowedSortFields.contains(sortField)) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
	                .body(new ProductListResponse("Invalid sort field: " + sortField));
	    }

	    try {
	        Page<Product> productPage = productService.getProductsByPageForAdmin(page, size, sortField, sortOrder);
	        List<Product> products = productPage.getContent();
	        int totalPages = productPage.getTotalPages(); // Sửa để lấy số trang từ productPage
	        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON)
	                .body(new ProductListResponse(products, totalPages));
	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body(new ProductListResponse("An error occurred while fetching products."));
	    }
	}


	@GetMapping("/product/{id}")
	public ResponseEntity<Product> viewProduct(@PathVariable Long id) {
		Product product = productService.getProductById(id);
		if (product != null) {
			return ResponseEntity.ok(product);
		}
		throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found");
	}

	// thêm sản phẩm có auth*************
//	@PostMapping("/product/add")
//	public ResponseEntity<String> addProduct(@RequestBody String payload, HttpSession session) {
//		// Check if the user is logged in
//		String username = (String) session.getAttribute("username");
//		if (username == null) {
//			return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You must be logged in to add a product.");
//		}
//
//		ObjectMapper objectMapper = new ObjectMapper();
//
//		try {
//			if (payload.trim().startsWith("[")) {
//				// Handle multiple products
//				List<Product> products = objectMapper.readValue(payload, new TypeReference<List<Product>>() {
//				});
//				for (Product product : products) {
//					validateProduct(product);
//					String categoryName = product.getCategory();
//					productService.saveProduct(product, categoryName);
//				}
//				return ResponseEntity.status(HttpStatus.CREATED).body("Products added successfully");
//			} else {
//				// Handle a single product
//				Product product = objectMapper.readValue(payload, Product.class);
//				validateProduct(product);
//				String categoryName = product.getCategory();
//				productService.saveProduct(product, categoryName);
//				return ResponseEntity.status(HttpStatus.CREATED).body("Product added successfully");
//			}
//		} catch (Exception e) {
//			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid product data", e);
//		}
//	}

	@PostMapping("/product/add")
	public ResponseEntity<String> addProduct(@RequestBody String payload) {
		ObjectMapper objectMapper = new ObjectMapper();
		try {
			System.out.println("Received payload: " + payload); // Log the incoming payload for debugging
			if (payload.trim().startsWith("[")) {
				List<ProductWrapper> productWrappers = objectMapper.readValue(payload,
						new TypeReference<List<ProductWrapper>>() {
						});
				for (ProductWrapper productWrapper : productWrappers) {
					Product product = productWrapper.getProduct();
					validateProduct(product); // Ensure this method does not throw an exception
					List<String> categoryNames = product.getCategories();
					productService.saveProduct(product, categoryNames);
				}
				return ResponseEntity.status(HttpStatus.CREATED).body("Products added successfully");
			} else {
				ProductWrapper productWrapper = objectMapper.readValue(payload, ProductWrapper.class);
				Product product = productWrapper.getProduct();
				validateProduct(product); // Ensure this method does not throw an exception
				List<String> categoryNames = product.getCategories();
				productService.saveProduct(product, categoryNames);
				return ResponseEntity.status(HttpStatus.CREATED).body("Product added successfully");
			}
		} catch (Exception e) {
			e.printStackTrace(); // Print stack trace for better debugging
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid product data", e);
		}
	}

	@PutMapping("/product/update/{id}")
	public ResponseEntity<Map<String, Object>> updateProduct(@PathVariable Long id, @RequestBody String payload) {
		ObjectMapper objectMapper = new ObjectMapper();
		Map<String, Object> response = new HashMap<>();

		try {
			Product product = objectMapper.readValue(payload, Product.class);
			productService.updateProduct(id, product);

			// Prepare a success response
			response.put("success", true);
			response.put("message", "Product updated successfully");
			return ResponseEntity.ok(response);

		} catch (JsonProcessingException e) {
			e.printStackTrace(); // Log the error for further inspection
			response.put("success", false);
			response.put("message", "Invalid product data: " + e.getMessage());
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);

		} catch (Exception e) {
			e.printStackTrace(); // Log general exceptions as well
			response.put("success", false);
			response.put("message", "An error occurred: " + e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}

	@DeleteMapping("/product/delete/{id}")
	public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
		if (productService.getProductById(id) == null) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found");
		}
		productService.deleteProduct(id);
		return ResponseEntity.ok("Product deleted successfully");
	}

	private void validateProduct(Product product) {
		if (product.getName() == null || product.getName().isEmpty()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product name is required");
		}
		if (product.getPrice() == null || product.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid product price");
		}
	}


	@GetMapping("/users")
	public ResponseEntity<Page<User>> listAllUsers(@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size) {
		try {
			Pageable paging = PageRequest.of(page, size);
			Page<User> pagedResult = userService.getAllUsers(paging);

			if (pagedResult.hasContent()) {
				return ResponseEntity.ok(pagedResult); // Return the entire Page object
			} else {
				return ResponseEntity.noContent().build();
			}
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	@DeleteMapping("users/{id}")
	public ResponseEntity<String> deleteUser(@PathVariable("id") Long id) {
		try {
			userService.deleteUserById(id);
			// Return HTTP 200 (OK) if deletion is successful with no body content
			return ResponseEntity.ok("User deleted successfully."); // Optional message for successful deletion
		} catch (IllegalArgumentException e) {
			// If user has the superadmin role, return a 400 Bad Request with the error
			// message
			return ResponseEntity.badRequest().body(e.getMessage()); // Send the error message in the response body
		} catch (Exception e) {
			// Handle any other exceptions and return a generic 500 Internal Server Error
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("An error occurred while deleting the user.");
		}
	}

	private void validateUser(User user) {
		if (user.getUsername() == null || user.getUsername().isEmpty()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username is required");
		}
		if (user.getEmail() == null || user.getEmail().isEmpty()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required");
		}
		// Add more validation as needed
	}
}
