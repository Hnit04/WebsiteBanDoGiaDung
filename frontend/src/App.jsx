import { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import CategorySection from './components/CategorySection.jsx';
import ProductModal from './components/ProductModal.jsx';
import CartSidebar from './components/CartSidebar.jsx';
import ChatPopup from './components/ChatPopup.jsx';
import HomePage from './pages/HomePage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import { setupDarkMode } from './assets/js/utils.jsx';
import { addToCart, getCart } from './assets/js/cartManager.jsx';

export default function App() {
    const [currentProduct, setCurrentProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        setupDarkMode(); // Set up dark mode on component mount
        const updateTotalItems = () => {
            const cart = getCart();
            const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
            setTotalItems(itemCount);
        };

        updateTotalItems(); // Cập nhật số lượng khi component mount
        window.addEventListener('storage', updateTotalItems);

        return () => {
            window.removeEventListener('storage', updateTotalItems);
        };
    }, []);

    const handleProductClick = (product) => {
        setCurrentProduct(product);
        setIsModalOpen(true);
    };

    const toggleCart = () => {
        setIsCartOpen(prev => !prev);
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <Router>
                <Header onCartClick={toggleCart} totalItems={totalItems} />
                <main>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/products" element={<ProductsPage onProductClick={handleProductClick} />} />
                        <Route path="/about" element={<AboutPage />} />
                    </Routes>
                </main>
                <Footer />
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
            </Router>
        </div>
    );
}