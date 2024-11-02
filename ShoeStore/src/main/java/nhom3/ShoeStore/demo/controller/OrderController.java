package nhom3.ShoeStore.demo.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import nhom3.ShoeStore.demo.model.Color;
import nhom3.ShoeStore.demo.model.Order;
import nhom3.ShoeStore.demo.model.OrderItem;
import nhom3.ShoeStore.demo.model.Product;
import nhom3.ShoeStore.demo.model.User;
import nhom3.ShoeStore.demo.security.JwtTokenUtil;
import nhom3.ShoeStore.demo.service.CartService;
import nhom3.ShoeStore.demo.service.ColorService;
import nhom3.ShoeStore.demo.service.OrderItemService;
import nhom3.ShoeStore.demo.service.OrderService;
import nhom3.ShoeStore.demo.service.ProductService;
import nhom3.ShoeStore.demo.service.SizeService;
import nhom3.ShoeStore.demo.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/order")
public class OrderController {

	@Autowired
	private final OrderService orderService;

	@Autowired
	private OrderItemService orderItemService;

	@Autowired
	private ProductService productService;

	@Autowired
	private ColorService colorService;

	@Autowired
	private SizeService sizeService;

	@Autowired
	private UserService userService;

	@Autowired
	private CartService cartService;
	
	@Autowired
	private JwtTokenUtil jwtTokenUtil;

	@Autowired
	public OrderController(OrderService orderService, OrderItemService orderItemService, ProductService productService,
			ColorService colorService, SizeService sizeService) {
		this.orderService = orderService;
		this.orderItemService = orderItemService;
		this.productService = productService;
		this.colorService = colorService;
		this.sizeService = sizeService;
	}

	@PostMapping("/place")
	public ResponseEntity<Order> placeOrder(@Valid @RequestBody OrderRequest orderRequest, HttpServletRequest request) {
	    try {
	        String token = request.getHeader("Authorization");

	        // Retrieve the userId from the token
	        Long userId = jwtTokenUtil.getUserIdFromToken(token.substring(7));

	        // Retrieve the User object using userId
	        User user = userService.getUserById(userId);

	        // Create a new order and assign information from the request
	        Order order = new Order();
	        order.setUser(user); // Set the User object
	        order.setOrderDate(null);
	        order.setFirstName(orderRequest.getFirstName());
	        order.setLastName(orderRequest.getLastName());
	        order.setEmail(orderRequest.getEmail());
	        order.setShippingAddress(orderRequest.getShippingAddress());
	        order.setPhoneNumber(orderRequest.getPhoneNumber());
	        order.setTotalPrice(orderRequest.getTotalPrice());

	        // Save the order
	        Order savedOrder = orderService.createOrder(order);

	        // Process each OrderItemRequest and save the order items
	        for (OrderItemRequest itemRequest : orderRequest.getItems()) {
	            OrderItem orderItem = new OrderItem();

	            // Retrieve product and color details from the database
	            Product product = productService.getProductById(itemRequest.getProductId());
	            Color color = colorService.getColorById(itemRequest.getSelectedColorId());

	            orderItem.setProduct(product);
	            orderItem.setSelectedSize(sizeService.getSizeById(itemRequest.getSelectedSizeId()));
	            orderItem.setSelectedColor(color);
	            orderItem.setQuantity(itemRequest.getQuantity());
	            orderItem.setUnitPrice(itemRequest.getUnitPrice());
	            orderItem.setOrder(savedOrder);

	            // Save each OrderItem to the database
	            orderItemService.addOrderItem(orderItem);

	            // Attempt to delete the CartItem by itemId
	            System.out.println("Attempting to delete CartItem with ID: " + itemRequest.getItemId());
	            boolean isDeleted = cartService.deleteCartItemById(itemRequest.getItemId());

	            if (!isDeleted) {
	                System.err.println("Failed to delete CartItem with ID: " + itemRequest.getItemId());
	            }
	        }

	        return ResponseEntity.status(HttpStatus.CREATED).body(savedOrder);
	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
	    }
	}


	@GetMapping("/{id}")
	public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
		try {
			Order order = orderService.getOrderById(id);
			return ResponseEntity.ok(order);
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}
	}

	@GetMapping("/all")
	public ResponseEntity<List<Order>> getAllOrders() {
		List<Order> orders = orderService.getAllOrders();
		return ResponseEntity.ok(orders);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
		try {
			orderService.deleteOrder(id);
			return ResponseEntity.noContent().build();
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}
	}

	// Class để lưu trữ thông tin yêu cầu đặt hàng
	public static class OrderRequest {
		private Long userId; // ID người dùng
		private String firstName; // Tên
		private String lastName; // Họ
		private String email;
		private String shippingAddress; // Địa chỉ giao hàng
		private String phoneNumber; // Số điện thoại
		private BigDecimal totalPrice; // Tổng giá tiền
		private List<OrderItemRequest> items; // Danh sách sản phẩm trong đơn hàng

		// Getters and Setters
		public String getFirstName() {
			return firstName;
		}

		public void setFirstName(String firstName) {
			this.firstName = firstName;
		}

		public String getLastName() {
			return lastName;
		}

		public void setLastName(String lastName) {
			this.lastName = lastName;
		}

		public String getEmail() {
			return email;
		}

		public void setEmail(String email) {
			this.email = email;
		}

		public String getShippingAddress() {
			return shippingAddress;
		}

		public void setShippingAddress(String shippingAddress) {
			this.shippingAddress = shippingAddress;
		}

		public String getPhoneNumber() {
			return phoneNumber;
		}

		public void setPhoneNumber(String phoneNumber) {
			this.phoneNumber = phoneNumber;
		}

		public List<OrderItemRequest> getItems() {
			return items;
		}

		public void setItems(List<OrderItemRequest> items) {
			this.items = items;
		}

		public Long getUserId() {
			return userId;
		}

		public void setUserId(Long userId) {
			this.userId = userId;
		}

		public BigDecimal getTotalPrice() {
			return totalPrice;
		}

		public void setTotalPrice(BigDecimal totalPrice) {
			this.totalPrice = totalPrice;
		}
	}

	public static class OrderItemRequest {
		private Long itemId;
		private Long productId;
		private Long selectedSizeId; // ID kích thước được chọn
		private Long selectedColorId; // ID màu sắc được chọn
		private int quantity;
		private BigDecimal unitPrice;

		// Getters and Setters
		public Long getProductId() {
			return productId;
		}

		public void setProductId(Long productId) {
			this.productId = productId;
		}

		public Long getSelectedSizeId() {
			return selectedSizeId;
		}

		public void setSelectedSizeId(Long selectedSizeId) {
			this.selectedSizeId = selectedSizeId;
		}

		public Long getSelectedColorId() {
			return selectedColorId;
		}

		public void setSelectedColorId(Long selectedColorId) {
			this.selectedColorId = selectedColorId;
		}

		public int getQuantity() {
			return quantity;
		}

		public void setQuantity(int quantity) {
			this.quantity = quantity;
		}

		public BigDecimal getUnitPrice() {
			return unitPrice;
		}

		public void setUnitPrice(BigDecimal unitPrice) {
			this.unitPrice = unitPrice;
		}

		public Long getItemId() {
			return itemId;
		}

		public void setItemId(Long itemId) {
			this.itemId = itemId;
		}

	}
}
