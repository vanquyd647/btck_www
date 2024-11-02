// OrderSummary.js
import React from 'react';
import DiscountCoupons from './DiscountCoupons';

const OrderSummary = ({ totalAmount }) => {
    const formattedTotal = totalAmount.toLocaleString('vi-VN') + ' đ';

    const handleCheckout = () => {
        window.location.href = '/checkout';
    };

    return (

        <div className="order-summary">
            <h2>THÔNG TIN ĐƠN HÀNG</h2>
            <div className="total-price">
                <span>Tổng tiền:</span> <span className="price">{formattedTotal}</span>
            </div>
            <ul className="shipping-info">
                <li>Phí vận chuyển sẽ được tính ở trang thanh toán.</li>
                <li>Bạn cũng có thể nhập mã giảm giá ở trang thanh toán.</li>
            </ul>
            <button className="order-btn" onClick={handleCheckout}>
                ĐẶT HÀNG NGAY (Áp dụng cho Việt Nam)
            </button>
            <button className="order-international-btn">ĐẶT HÀNG QUỐC TẾ (Cho các quốc gia khác)</button>
            <DiscountCoupons />
        </div>
    );
};

export default OrderSummary;
