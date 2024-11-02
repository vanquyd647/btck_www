// CartItem.js
import React from 'react';
import { useNavigate } from "react-router-dom";

const CartItem = ({ item, onRemove }) => {
    const navigate = useNavigate();
    const formattedPrice = item.product.price.toLocaleString('vi-VN') + ' đ';
    const handleNavigateToCollections = (slug) => {
        navigate(`/product-detail/${slug}`); // Chuyển hướng đến trang collections với slug
    };
    return (
        <div className="cart-item">
            <a onClick={() => handleNavigateToCollections(item.product.slug)} >
                <img src={item.selectedColor.image} alt="Product" className="img-item" />
            </a>
            <div className="item-details">
                <a onClick={() => handleNavigateToCollections(item.product.slug)}>
                    <h2>{item.product.name}</h2>
                    <p>Kích thước: {item.selectedSize.euSize}, {item.selectedSize.size}, {item.selectedSize.ukSize}</p>
                    <p>Màu sắc: {item.selectedColor.color}</p>
                </a>
                <div className="price-quantity">
                    <p>{formattedPrice}</p>
                    <p>Số lượng: {item.quantity}</p>
                    <button onClick={() => onRemove(item.id)} className="remove-from-cart-btn">
                        <i className="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
