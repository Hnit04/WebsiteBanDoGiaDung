import React, { useState, useEffect } from 'react';
import { formatPrice, generateRatingStars, getProductIcon } from '../assets/js/utils.jsx';
import { addToCart } from '../assets/js/cartManager.jsx';

const ProductModal = ({ product, isOpen, onClose }) => {
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);

    useEffect(() => {
        // Reset quantity when new product is selected
        if (product) {
            setQuantity(1);
            setAddedToCart(false);
        }
    }, [product]);

    if (!product || !isOpen) return null;

    const handleAddToCart = () => {
        addToCart(product, quantity);
        setAddedToCart(true);

        // Reset state after delay
        setTimeout(() => {
            setAddedToCart(false);
        }, 2000);
    };

    const handleBuyNow = () => {
        // Xử lý mua ngay - thêm vào giỏ rồi mở giỏ hàng
        // Cần import các hàm từ cartManager
        import('../assets/js/cartManager.jsx').then(({ clearCart, addToCart, toggleCartSidebar }) => {
            clearCart();
            addToCart(product, quantity);
            onClose();
            toggleCartSidebar();
        });
    };

    return (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog modal-dialog-centered modal-xl modal-fullscreen-md-down">
                <div className="modal-content">
                    <div className="modal-header">
                        <h3 className="modal-title fs-5">{product.name}</h3>
                        <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="bg-light rounded w-100 h-100 d-flex align-items-center justify-content-center">
                                    <i className={`${getProductIcon(product)} fs-1 text-secondary`}></i>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="d-flex align-items-center mb-3">
                                    <div
                                        className="text-warning me-2"
                                        dangerouslySetInnerHTML={{ __html: generateRatingStars(product.rating) }}
                                    ></div>
                                    <span className="text-muted small">({product.reviewCount} đánh giá)</span>
                                </div>
                                <h4 className="text-primary fw-bold mb-3">{formatPrice(product.price)}</h4>
                                <p className="text-muted mb-4">{product.description}</p>
                                <div className="d-flex align-items-center mb-4">
                                    <label htmlFor="modalQuantity" className="me-3 text-muted">Số lượng:</label>
                                    <div className="input-group">
                                        <button
                                            className="btn btn-outline-secondary"
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        >-</button>
                                        <input
                                            type="number"
                                            min="1"
                                            value={quantity}
                                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                            className="form-control text-center"
                                        />
                                        <button
                                            className="btn btn-outline-secondary"
                                            onClick={() => setQuantity(quantity + 1)}
                                        >+</button>
                                    </div>
                                </div>
                                <div className="d-flex gap-3">
                                    <button
                                        className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
                                        onClick={handleAddToCart}
                                    >
                                        {addedToCart
                                            ? <><i className="fa fa-check me-2"></i> Đã thêm</>
                                            : <><i className="fa fa-cart-plus me-2"></i> Thêm vào giỏ</>
                                        }
                                    </button>
                                    <button
                                        className="btn btn-secondary w-100"
                                        onClick={handleBuyNow}
                                    >
                                        Mua ngay
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;