import { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import CategorySection from './components/CategorySection.jsx';
import ProductModal from './components/ProductModal.jsx';
import CartSidebar from './components/CartSidebar.jsx';
import ChatPopup from './components/ChatPopup.jsx';
import HomePage from './pages/HomePage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import { setupDarkMode } from './assets/js/utils.jsx';
import './index.css';

export default function App() {
    const [currentProduct, setCurrentProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Thiết lập dark mode khi ứng dụng mount lần đầu
    useLayoutEffect(() => {
        setupDarkMode();
    }, []);

    // Xử lý khi người dùng chọn một sản phẩm
    const handleProductClick = useCallback((product) => {
        setCurrentProduct(product);
        setIsModalOpen(true);
    }, []);

    // Xử lý khi chọn danh mục
    const handleCategorySelect = useCallback((category) => {
        setSelectedCategory(category);
        requestAnimationFrame(() => {
            document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
        });
    }, []);

    // Bật/tắt sidebar giỏ hàng
    const toggleCart = useCallback(() => {
        setIsCartOpen((prev) => !prev);
    }, []);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <Header onCartClick={toggleCart} />

            <main>
                <HomePage />
                <CategorySection onCategorySelect={handleCategorySelect} />
                <ProductsPage
                    onProductClick={handleProductClick}
                    selectedCategory={selectedCategory}
                />
                <AboutPage />
            </main>

            <Footer />

            {/* Các component modal và popup */}
            <ProductModal
                product={currentProduct}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            <CartSidebar
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
            />

            <ChatPopup />
        </div>
    );
}
