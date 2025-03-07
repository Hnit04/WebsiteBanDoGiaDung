import React, { useState } from 'react';

const Header = ({ onCartClick }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header className="bg-white shadow-sm sticky-top py-3">
            <div className="container">
                <div className="d-flex justify-content-between align-items-center">
                    {/* Logo */}
                    <div className="d-flex align-items-center">
                        <i className="fa fa-home text-primary fs-3 me-2"></i>
                        <h1 className="h4 text-primary fw-bold">HomeCraft</h1>
                    </div>

                    {/* Navigation */}
                    <nav className="d-none d-md-flex align-items-center gap-4">
                    <a href="#" className="text-dark hover-text-primary fw-medium">Trang chủ</a>
                        <a href="#products" className="text-dark hover-text-primary fw-medium">Sản phẩm</a>
                        <a href="#categories" className="text-dark hover-text-primary fw-medium">Danh mục</a>
                        <a href="#about" className="text-dark hover-text-primary fw-medium">Giới thiệu</a>
                    </nav>

                    {/* Actions */}
                    <div className="d-flex align-items-center gap-3">
                        <div className="position-relative">
                            <button
                                onClick={onCartClick}
                                className="text-dark hover-text-primary position-relative"
                            >
                                <i className="fa fa-shopping-cart fs-4"></i>
                                <span id="cartBadge" className="badge bg-danger position-absolute top-0 start-100 translate-middle rounded-circle">0</span>
                            </button>
                        </div>
                        <button
                            onClick={toggleMobileMenu}
                            className="d-md-none text-dark"
                        >
                            <i className="fa-solid fa-bars fs-4"></i>
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                <div className={`d-md-none ${isMobileMenuOpen ? 'd-block' : 'd-none'} py-3`}>
                    <a href="#" className="d-block py-2 text-dark hover-text-primary fw-medium">Trang chủ</a>
                    <a href="#products" className="d-block py-2 text-dark hover-text-primary fw-medium">Sản phẩm</a>
                    <a href="#categories" className="d-block py-2 text-dark hover-text-primary fw-medium">Danh mục</a>
                    <a href="#about" className="d-block py-2 text-dark hover-text-primary fw-medium">Giới thiệu</a>
                </div>
            </div>
        </header>
    );
};

export default Header;