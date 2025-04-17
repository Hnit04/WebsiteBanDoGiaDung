import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
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
import ProductDetailPage from './pages/ProductDetailPage.jsx';

import { setupDarkMode } from './assets/js/utils.jsx';
import { addToCart, getCart } from './assets/js/cartManager.jsx';

export default function App() {
    const [currentProduct, setCurrentProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        const updateTotalItems = () => {
            const cart = getCart();
            const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
            setTotalItems(itemCount);
        };

        updateTotalItems();
        window.addEventListener('storage', updateTotalItems);
        return () => window.removeEventListener('storage', updateTotalItems);
    }, []);

    const handleAddToCart = () => {
        const cart = getCart();
        const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
        setTotalItems(itemCount);
    };

    useEffect(() => {
        setupDarkMode();
    }, []);

    const handleProductClick = (product) => {
        setCurrentProduct(product);
        setIsModalOpen(true);
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
    };

    const toggleCart = () => setIsCartOpen(prev => !prev);

    return (
        <Router>
            <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
                <Header onCartClick={toggleCart} totalItems={totalItems} />

                <Routes>
                    <Route
                        path="/"
                        element={
                            <>
                                <main>
                                    <HomePage />
                                    <CategorySection onCategorySelect={handleCategorySelect} />
                                    <ProductsPage
                                        onProductClick={handleProductClick}
                                        selectedCategory={selectedCategory}
                                    />
                                    <AboutPage />
                                </main>
                            </>
                        }
                    />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                </Routes>

                <Footer />

                {/* Modal and popup components */}
                <ProductModal
                    product={currentProduct}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    updateTotalItems={handleAddToCart}
                />
                <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
                <ChatPopup />
            </div>
        </Router>
    );
}
