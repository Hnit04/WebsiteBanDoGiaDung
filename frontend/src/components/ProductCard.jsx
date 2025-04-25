import React from 'react';
import { formatPrice, generateRatingStars, getProductIcon } from '../assets/js/utils.jsx';

const ProductCard = ({ product, onClick }) => {
    return (
        <div
            className="product-card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform transform hover:scale-105"
            onClick={() => onClick(product)} // Gọi hàm khi nhấp vào sản phẩm
        >
            <div className="bg-gray-100 h-48 flex items-center justify-center">
                <img src={product.image} alt={product.name} className="object-contain h-full" />
            </div>
            <div className="p-4">
                <h3 className="text-lg font-medium">{product.name}</h3>
                <div className="flex items-center mb-2">
                    <div
                        className="text-yellow-500 mr-2"
                        dangerouslySetInnerHTML={{ __html: generateRatingStars(product.rating) }}
                    ></div>
                    <span className="text-gray-500 text-sm">({product.reviewCount})</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-600">{formatPrice(product.price)}</span>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;