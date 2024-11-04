import React from "react";
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

function App() {
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
      </Routes>
    </Router>
  );
}

export default App;
