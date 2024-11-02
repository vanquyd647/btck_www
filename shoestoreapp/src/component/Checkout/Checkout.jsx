import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../css/Checkout.css';


function Checkout() {
    const [checkoutCartItems, setCheckoutCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [userId, setUserId] = useState(0);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        shippingAddress: "",
        phoneNumber: "",
        paymentMethod: "cod"
    });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const user = payload.user ? JSON.parse(payload.user) : null;
            if (user) {
                setUserId(user.id);
            }
        }

        // Load cart items from localStorage
        const savedItems = JSON.parse(localStorage.getItem('checkoutCartItems')) || [];
        setCheckoutCartItems(savedItems);

        // Calculate total price
        const calculatedTotal = savedItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
        setTotalPrice(calculatedTotal);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handlePaymentMethodChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            paymentMethod: e.target.value
        }));
    };

    const handleOrderConfirmation = () => {
        const token = localStorage.getItem('token');
        const orderData = {
            ...formData,
            items: checkoutCartItems.map(item => ({
                itemId: item.id,
                productId: item.product.id,
                selectedSizeId: item.selectedSize.id,
                selectedColorId: item.selectedColor.id,
                quantity: item.quantity,
                unitPrice: item.product.price
            })),
            totalPrice
        };
    
        fetch('http://localhost:8088/api/v1/order/place', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(orderData)
        })
        .then(response => {
            if (!response.ok) throw new Error('Order placement failed');
            return response.json();
        })
        .then(data => {
            console.log('Order placed:', data);
            navigate('/confirmation');
        })
        .catch(error => console.error('Error placing order:', error));
    };
    

    return (
        <div className="checkout-container">
            <div className="checkout-cart">
                <h2>Giỏ hàng của bạn</h2>
                <div className="checkout-cart-items">
                    {checkoutCartItems.length > 0 ? (
                        checkoutCartItems.map(item => (
                            <div key={item.id} className="cart-item">
                                <img src={item.selectedColor.image} alt="Product" className="img-item" />
                                <div className="item-details">
                                    <h2>{item.product.name}</h2>
                                    <p>Size: {item.selectedSize.euSize}</p>
                                    <p>Màu sắc: {item.selectedColor.color}</p>
                                    <p>Giá: {item.product.price.toLocaleString('vi-VN')} đ</p>
                                    <p>Số lượng: {item.quantity}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No items in the cart.</p>
                    )}
                </div>
                <div className="total-price">
                    Tổng giá trị: {totalPrice.toLocaleString('vi-VN')} đ
                </div>
            </div>

            <div className="checkout-order">
                <div className="order-form">
                    <h2>Thông tin đặt hàng</h2>
                    <input type="text" name="firstName" placeholder="Họ" required value={formData.firstName} onChange={handleInputChange} />
                    <input type="text" name="lastName" placeholder="Tên" required value={formData.lastName} onChange={handleInputChange} />
                    <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleInputChange} />
                    <input type="text" name="shippingAddress" placeholder="Địa chỉ giao hàng" required value={formData.shippingAddress} onChange={handleInputChange} />
                    <input type="tel" name="phoneNumber" placeholder="Số điện thoại" required value={formData.phoneNumber} onChange={handleInputChange} />
                    
                    <label htmlFor="paymentMethod">Phương thức thanh toán:</label>
                    <select id="paymentMethod" name="paymentMethod" required value={formData.paymentMethod} onChange={handlePaymentMethodChange}>
                        <option value="cod">Thanh toán khi nhận hàng (COD)</option>
                        <option value="bank">Chuyển khoản ngân hàng</option>
                        <option value="credit">Thẻ tín dụng</option>
                    </select>

                    <div className="payment-info">
                        <h3>Thông tin thanh toán</h3>
                        <div className="payment-details">
                            <p>Phương thức thanh toán đã chọn: <span>{formData.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : formData.paymentMethod}</span></p>
                            <p>Tổng giá trị thanh toán: {totalPrice.toLocaleString('vi-VN')} đ</p>
                            <p>Lưu ý: Đơn hàng sẽ được xác nhận qua điện thoại trước khi giao.</p>
                        </div>
                    </div>
                    <button className="confirm-order-btn" onClick={handleOrderConfirmation}>Xác nhận đơn hàng</button>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
