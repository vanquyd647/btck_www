import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import IndexPage from "./component/index/index"; // Đảm bảo import đúng
import ProductDetail from "./component/product-detail/product-detail";
import Register from "./component/Register/Register";
import Cart from "./component/cart/Cart";
import Checkout from "./component/Checkout/Checkout";
import Collections from "./component/collections/collections";
import AdminDashboard from "./component/AdminDashboard/AdminDashboard";
import AddProduct from "./component/AddProduct/AddProduct";
import UserManagement from "./component/UserManagement/UserManagement";
import ProductManagement from "./component/ProductManagement/ProductManagement";
import AddEditUser from "./component/AddEditUser/AddEditUser";
import CategoryManagement from "./component/CategoryManagement/CategoryManagement";
import ProductCategoryManagement from "./component/ProductCategoryManagement/ProductCategoryManagement"; 
import EditProduct from "./component/EditProduct/EditProduct"; 
import OrderManagement from "./component/OrderManagement/OrderManagement";
import OrderDetails from "./component/OrderDetails/OrderDetails";

function App() {
  // Hàm làm mới token khi token hết hạn
  const refreshAccessToken = async () => {
    try {
      const response = await axios.post("http://localhost:8088/api/v1/auth/refresh", {
        refreshToken: localStorage.getItem("refreshToken"), // Giả định bạn đã lưu refresh token ở localStorage
      });

      const newAccessToken = response.data.token;
      localStorage.setItem("token", newAccessToken); // Lưu token mới vào localStorage

      return newAccessToken;
    } catch (error) {
      console.error("Làm mới token thất bại:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login"; // Nếu làm mới token thất bại, chuyển hướng đến trang đăng nhập
    }
  };

  // Kiểm tra token khi ứng dụng khởi chạy
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const tokenExpiration = payload.exp * 1000;
      
      console.log("Token expiration:", tokenExpiration);

      // Nếu token đã hết hạn, làm mới token
      if (Date.now() > tokenExpiration) {
        refreshAccessToken();
      }
    }
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/product-detail/:slug" element={<ProductDetail />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/collections/:slug" element={<Collections />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/add-product" element={<AddProduct />} />
        <Route path="/admin/user-management" element={<UserManagement />} />
        <Route path="/admin/product-management" element={<ProductManagement />} />
        <Route path="/admin/add-edit-user" element={<AddEditUser />} />
        <Route path="/admin/category-management" element={<CategoryManagement />} />
        <Route path="/admin/product-category-management" element={<ProductCategoryManagement />} />
        <Route path="/admin/edit-product/:slug" element={<EditProduct />} />
        <Route path="/admin/order-management" element={<OrderManagement />} />
        <Route path="/admin/order-details/:orderId" element={<OrderDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
