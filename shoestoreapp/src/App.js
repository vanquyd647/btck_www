import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import IndexPage from "./component/index/index"; // Đảm bảo import đúng
import ProductDetail from "./component/product-detail/product-detail";
import Register from "./component/Register/Register";
import Cart from "./component/cart/Cart";
import Checkout from "./component/Checkout/Checkout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/product-detail/:slug" element={<ProductDetail />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </Router>
  );
}

export default App;
