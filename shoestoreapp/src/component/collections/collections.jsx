import React from "react";
import { useParams } from "react-router-dom";

function Collections() {
    const { slug } = useParams(); // Lấy slug từ URL

    return (
        <div>
            <h1>Bộ Sưu Tập cho sản phẩm: {slug}</h1>
            {/* Hiển thị nội dung của bộ sưu tập ở đây */}
        </div>
    );
}

export default Collections;
