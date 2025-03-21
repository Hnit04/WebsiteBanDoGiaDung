import React, { useState, useEffect } from "react";
import { formatPrice, generateRatingStars } from "../assets/js/utils.jsx";
import { addToCart } from "../assets/js/cartManager.jsx";

const ProductModal = ({ product, isOpen, onClose }) => {
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);

    useEffect(() => {
        if (product) {
            setQuantity(1);
            setAddedToCart(false);
        }
    }, [product]);

    if (!product || !isOpen) return null;

    const handleAddToCart = () => {
        addToCart(product, quantity);
        setAddedToCart(true);

        setTimeout(() => {
            setAddedToCart(false);
        }, 2000);
    };

    return (
        <div
            className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn"
            onClick={onClose} // Click ngoài modal để đóng
        >
            <div
                className="bg-white shadow-xl rounded-2xl border border-gray-300 p-6 max-w-2xl w-full relative"
                onClick={(e) => e.stopPropagation()} // Ngăn modal đóng khi click bên trong
            >
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-3">
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
                        <i className="fa fa-times text-xl"></i>
                    </button>
                </div>

                {/* Body */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {/* Product Image */}
                    <div className="flex items-center justify-center bg-gray-100 rounded-lg p-6">
                        <img src={product.image} alt={product.name} className="h-40 object-contain" />
                    </div>

                    {/* Product Info */}
                    <div>
                        <div className="flex items-center text-yellow-500 space-x-2 mb-2">
                            <div dangerouslySetInnerHTML={{ __html: generateRatingStars(product.rating) }}></div>
                            <span className="text-gray-500 text-sm">({product.reviewCount} đánh giá)</span>
                        </div>
                        <h4 className="text-2xl font-bold text-blue-600">{formatPrice(product.price)}</h4>
                        <p className="text-gray-600 mt-2">{product.description}</p>

                        {/* Quantity Selector */}
                        <div className="flex items-center mt-4 space-x-2">
                            <span className="text-gray-500">Số lượng:</span>
                            <div className="flex items-center border rounded-lg shadow-sm">
                                <button
                                    className="px-3 py-1 text-gray-700 hover:bg-gray-200 rounded-l-lg"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    className="w-12 text-center border-l border-r outline-none appearance-none"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                />
                                <button
                                    className="px-3 py-1 text-gray-700 hover:bg-gray-200 rounded-r-lg"
                                    onClick={() => setQuantity(quantity + 1)}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 mt-4">
                            <button
                                className={`w-full py-2 rounded-xl flex items-center justify-center transition shadow-md ${
                                    addedToCart ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"
                                }`}
                                onClick={handleAddToCart}
                            >
                                <i className={`fa ${addedToCart ? "fa-check" : "fa-cart-plus"} mr-2`}></i>
                                {addedToCart ? "Đã thêm" : "Thêm vào giỏ"}
                            </button>
                            <button
                                className="w-full py-2 bg-gray-300 text-gray-800 rounded-xl hover:bg-gray-400 transition shadow-md"
                                onClick={onClose}
                            >
                                Mua ngay
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;
