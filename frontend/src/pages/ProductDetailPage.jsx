import React from 'react';

const ProductDetailPage = ({ match }) => {
    const productId = match.params.id; // Lấy ID sản phẩm từ URL

    // Logic để lấy thông tin sản phẩm dựa trên ID
    // Ở đây bạn có thể gọi API hoặc sử dụng dữ liệu tĩnh

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Chi tiết sản phẩm #{productId}</h1>
            {/* Thêm thông tin sản phẩm ở đây */}
        </div>
    );
};

export default ProductDetailPage;