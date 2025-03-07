import React, { useEffect } from 'react';
import { formatPrice, getProductIcon } from '../assets/js/utils.jsx';
import { getCart, removeFromCart } from "../assets/js/cartManager.jsx";

const CartSidebar = ({ isOpen, onClose }) => {
    const [cart, setCart] = React.useState();
    const [total, setTotal] = React.useState(0);

    useEffect(() => {
        // Update cart when opened
        if (isOpen) {
            updateCart();
        }
    }, [isOpen]);

    const updateCart = () => {
        const currentCart = getCart();
        setCart(currentCart);

        const cartTotal = currentCart.reduce((sum, item) =>
            sum + (item.product.price * item.quantity), 0);
        setTotal(cartTotal);
    };

    const handleRemoveItem = (index) => {
        removeFromCart(index);
        updateCart();
    };

    if (!isOpen) return null;

    return (
        <div className="position-fixed top-0 end-0 w-full md:w-96 bg-white shadow z-50">
            <div className="h-full d-flex flex-column">
                <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
                    <h3 className="h3">Giỏ hàng</h3>
                    <button
                        onClick={onClose}
                        className="text-secondary"
                    >
                        <i className="fa fa-times fs-4"></i>
                    </button>
                </div>
                <div className="flex-grow-1 overflow-auto p-4">
                    {cart.length === 0 ? (
                        <div className="text-center text-secondary py-8">
                            <i className="fa fa-shopping-cart fs-1 mb-4"></i>
                            <p>Giỏ hàng của bạn đang trống</p>
                        </div>
                    ) : (
                        cart.map((item, index) => (
                            <div key={`${item.product.id}-${index}`} className="d-flex align-items-start py-4 border-bottom">
                                <div className="bg-light w-16 h-16 rounded-circle d-flex align-items-center justify-content-center me-4">
                                    <i className={`${getProductIcon(item.product)} fs-4 text-secondary`}></i>
                                </div>
                                <div className="flex-grow-1">
                                    <h4 className="fw-medium">{item.product.name}</h4>
                                    <div className="d-flex align-items-center justify-content-between mt-2">
                                        <div className="text-muted small">
                                            <span>{formatPrice(item.product.price)}</span>
                                            <span className="mx-1">×</span>
                                            <span>{item.quantity}</span>
                                        </div>
                                        <span className="fw-medium">
                                            {formatPrice(item.product.price * item.quantity)}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    className="text-secondary hover-text-danger p-1 ms-2"
                                    onClick={() => handleRemoveItem(index)}
                                >
                                    <i className="fa fa-times"></i>
                                </button>
                            </div>
                        ))
                    )}
                </div>
                <div className="p-4 border-top">
                    <div className="d-flex justify-content-between mb-4">
                        <span className="text-muted">Tổng tiền:</span>
                        <span className="fw-bold">{formatPrice(total)}</span>
                    </div>
                    <button
                        className={`w-100 btn btn-primary ${
                            cart.length === 0 ? 'disabled' : ''
                        }`}
                        disabled={cart.length === 0}
                        onClick={() => alert('Chức năng thanh toán đang được phát triển!')}
                    >
                        Thanh toán
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartSidebar;