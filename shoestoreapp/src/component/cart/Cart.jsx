// Cart.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import CartItem from './CartItem';
import OrderSummary from './OrderSummary';
import MenuBar from '../index/menuBar';
import BannerFooter from '../index/BannerFooter';
import Footer from '../index/Footer';
import '../css/Cart.css';

const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);

    const token = localStorage.getItem('token');
    useEffect(() => {
        fetchCartItems();
    }, []);
    
    useEffect(() => {
        // Update localStorage when cartItems state changes
        localStorage.setItem('checkoutCartItems', JSON.stringify(cartItems));
    }, [cartItems]); // Depend on cartItems
    
    const fetchCartItems = () => {
        if (!token) {
            // Fetch cart from localStorage if user is a guest
            const guestCart = localStorage.getItem('guestCart');
            const parsedGuestCart = guestCart ? JSON.parse(guestCart) : [];
    
            setCartItems(parsedGuestCart); // Update state with guest cart
            const total = parsedGuestCart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
            setTotalAmount(total);
        } else {
            // Fetch cart from server for logged-in users
            fetch('http://localhost:8088/api/v1/cart', {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            })
                .then(response => {
                    if (!response.ok) throw new Error('Failed to fetch cart items');
                    return response.json();
                })
                .then(data => {
                    setCartItems(data);
                    const total = data.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
                    setTotalAmount(total);
                })
                .catch(error => console.error('Error fetching cart items:', error));
        }
    };
    


    console.log(CartItem)

    const handleRemove = (cartItemId) => {
        if (token) {
            // User is logged in; delete item via API
            fetch(`http://localhost:8088/api/v1/cart/remove/${cartItemId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            })
                .then(() => fetchCartItems()) // Refresh cart items after deletion
                .catch(error => console.error('Error removing product from cart:', error));
        } else {
            // User is a guest; remove item from localStorage
            const guestCart = JSON.parse(localStorage.getItem('guestCart')) || [];
            const updatedCart = guestCart.filter(item => item.id !== cartItemId);

            // Save updated cart back to localStorage
            localStorage.setItem('guestCart', JSON.stringify(updatedCart));

            // Optionally update the state to re-render the cart component
            fetchCartItems(); // Assuming fetchCartItems refreshes the displayed cart items
        }
    };



    return (
        <main>
            <MenuBar />
            <div className="content">
                <div className="cart-container">
                    <h1>Giỏ mua hàng</h1>
                    <div className="cart-items">
                        {cartItems.map(item => (
                            <CartItem key={item.id} item={item} onRemove={handleRemove} />
                        ))}
                    </div>
                </div>
                <OrderSummary totalAmount={totalAmount} />
            </div>
            <BannerFooter />
            <Footer />
        </main>
    );
};

export default Cart;
