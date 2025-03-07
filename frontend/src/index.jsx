import { setupDarkMode } from './assets/js/utils.js';
import { toggleCartSidebar } from './assets/js/cartManager.jsx';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ProductModal from './components/ProductModal.jsx';
import CartSidebar from './components/CartSidebar.jsx';
import CategorySection from './components/CategorySection.jsx';
import ChatPopup from './components/ChatPopup.jsx';

class App {
    constructor() {
        this.productModal = new ProductModal();
        this.productsPage = new ProductsPage(
            (product) => this.productModal.open(product)
        );
        this.categorySection = new CategorySection(
            (category) => this.productsPage.setCategoryFilter(category)
        );
        this.chatPopup = new ChatPopup();
    }

    init() {
        // Setup dark mode
        setupDarkMode();

        // Render components
        this.renderApp();

        // Initialize event listeners
        this.initEventListeners();
    }

    renderApp() {
        const appContainer = document.getElementById('app');

        // Create header
        const header = new Header();

        // Create pages
        const homePage = new HomePage();

        // Create footer
        const footer = new Footer();

        // Create cart sidebar
        const cartSidebar = new CartSidebar();

        // Render all components
        appContainer.innerHTML = `
            ${header.render()}
            ${homePage.render()}
            ${this.categorySection.render()}
            ${this.productsPage.render()}
            ${new AboutPage().render()}
            ${footer.render()}
            ${this.productModal.render()}
            ${cartSidebar.render()}
            ${this.chatPopup.render()}
        `;
    }

    initEventListeners() {
        // Initialize header events
        const header = new Header();
        header.initEventListeners();

        // Initialize product modal events
        this.productModal.initEventListeners();

        // Initialize products page events
        this.productsPage.initEventListeners();

        // Initialize category section events
        this.categorySection.initEventListeners();

        // Initialize cart sidebar events
        const cartSidebar = new CartSidebar();
        cartSidebar.initEventListeners();

        // Initialize chat popup events
        this.chatPopup.initEventListeners();

        // Cart button
        const cartBtn = document.getElementById('cartBtn');
        cartBtn.addEventListener('click', toggleCartSidebar);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});