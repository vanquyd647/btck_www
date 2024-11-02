import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../css/index.css'; // Đường dẫn tới file CSS của bạn

const Body = ({ message }) => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 30;

    const navigate = useNavigate(); // Khởi tạo useNavigate

    const handleNavigateToCollections = (slug) => {
        navigate(`/product-detail/${slug}`); // Chuyển hướng đến trang collections với slug
    };

    useEffect(() => {
        fetchProducts(0, pageSize); // Fetch initial products
    }, []);

    const fetchProducts = async (page, size) => {
        try {
            const response = await axios.get(`http://localhost:8088/api/v1/products?page=${page}&size=${size}`);
            const { products, totalPages } = response.data;
            if (products && products.length > 0) {
                setProducts(prev => [...prev, ...products]);
                setCurrentPage(page);
                manageLoadMoreButton(totalPages);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const manageLoadMoreButton = (totalPages) => {
        const loadMoreButton = document.getElementById("load-more-button");
        loadMoreButton.style.display = (currentPage < totalPages - 1) ? "block" : "none"; // Show or hide button
    };

    const loadMoreProducts = () => {
        fetchProducts(currentPage + 1, pageSize); // Fetch the next page
    };

    return (
        <main>
            <div className="container-product">
                <main>
                    <p>{message}</p> {/* Hiển thị thông điệp từ props */}
                </main>
                <div className="products-home">
                    <h2>Sản phẩm nổi bật ✨</h2>
                    <div className="product-list">
                        <div className="showProduct" id="product-container">
                            {products.map(product => {
                                const formattedPrice = product.price.toLocaleString('vi-VN') + ' đ';
                                return (
                                    <div
                                        key={`${product.slug}-${product.brand || ''}`} // Dùng slug và brand (hoặc bất kỳ thuộc tính nào khác) để tạo key duy nhất
                                        className="cartProduct"
                                        onClick={() => handleNavigateToCollections(product.slug)} // Gọi hàm khi nhấp
                                    >
                                        <img loading="lazy" src={product.images[0]} className="imgProduct" alt="Product Image" />
                                        <div className="title">
                                            <div className="details">
                                                <div className="title-1">
                                                    <h2 className="nameProduct">{product.name}</h2>
                                                    <p>Price: {formattedPrice}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
            <div id="load-more-container">
                <button id="load-more-button" style={{ display: 'none' }} onClick={loadMoreProducts}>Xem Thêm</button>
            </div>
        </main>
    );
};

export default Body;
