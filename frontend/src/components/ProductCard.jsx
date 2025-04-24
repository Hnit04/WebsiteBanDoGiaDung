import React from "react";
import { formatPrice, generateRatingStars } from "../assets/js/utils.jsx";

const ProductCard = ({ product, onClick }) => {
    return (
        <div
            className="bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer hover:shadow-xl transition"
            onClick={() => onClick(product)}
        >
            {/* Product Image */}
            <div className="h-40 overflow-hidden">
                <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            </div>

            {/* Product Details */}
            <div className="p-4">
                <h3 className="text-lg font-semibold">{product.name}</h3>

                {/* Rating */}
                <div className="flex items-center space-x-2 text-yellow-500 mt-2">
                    <div dangerouslySetInnerHTML={{ __html: generateRatingStars(product.rating) }}></div>
                    <span className="text-gray-500 text-sm">({product.reviewCount})</span>
                </div>

                {/* Price & View Button */}
                <div className="flex items-center justify-between mt-4">
                    <span className="text-xl font-bold text-blue-600">{formatPrice(product.price)}</span>
                    <button
                        className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition"
                        onClick={(e) => {
                            e.stopPropagation();
                            onClick(product);
                        }}
                    >
                        <i className="fa fa-eye text-gray-700"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
