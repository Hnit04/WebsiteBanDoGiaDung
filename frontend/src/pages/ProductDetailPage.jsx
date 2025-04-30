import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../assets/js/productData';
import { addToCart, clearCart, toggleCartSidebar } from '../assets/js/cartManager';
import { formatPrice } from '../assets/js/utils';
// import UpdateProductModal from '../components/UpdateProductModal.jsx';

const ProductDetailPage = () => {
    const { id } = useParams();
    const productId = parseInt(id);
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [currentStatus, setCurrentStatus] = useState('');
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    const userRole = localStorage.getItem('role');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    useEffect(() => {
        const foundProduct = products.find(p => p.id === productId);
        setProduct(foundProduct);
        setCurrentStatus(foundProduct ? foundProduct.status : '');
        setQuantity(1);
    }, [productId]);

    if (!product) {
        return (
            <div className="p-8 text-center text-gray-600">
                <h2 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h2>
                <p>Vui lòng kiểm tra lại liên kết hoặc quay lại <Link to="/" className="text-blue-600 hover:underline">Trang chủ</Link>.</p>
            </div>
        );
    }

    const checkIfLoggedIn = () => isLoggedIn;

    const handleAddToCart = () => {
        if (!checkIfLoggedIn()) {
            alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.');
            return;
        }

        addToCart(product, quantity);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const handleBuyNow = () => {
        if (!checkIfLoggedIn()) {
            alert('Vui lòng đăng nhập để mua sản phẩm.');
            return;
        }

        clearCart();
        addToCart(product, quantity);
        toggleCartSidebar();
    };

    const toggleStatusDropdown = () => {
        setShowStatusDropdown(!showStatusDropdown);
    };

    const handleStatusChange = (newStatus) => {
        console.log(`Cập nhật trạng thái sản phẩm ${productId} thành: ${newStatus}`);
        setCurrentStatus(newStatus);
        setShowStatusDropdown(false);
        setProduct(prevProduct => ({ ...prevProduct, status: newStatus }));
    };

    const handleOpenUpdateModal = () => {
        setShowUpdateModal(true);
    };

    const handleCloseUpdateModal = () => {
        setShowUpdateModal(false);
    };

    const handleProductUpdated = (updatedProduct) => {
        setProduct(updatedProduct);
        handleCloseUpdateModal();
        console.log('Thông tin sản phẩm đã được cập nhật:', updatedProduct);
    };

    const relatedProducts = products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    return (
        <div className="p-6 max-w-6xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg">
            <nav className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                <Link to="/" className="hover:text-black">Trang chủ</Link>
                <span className="mx-2">{'>'}</span>
                <span>Chi tiết sản phẩm</span>
            </nav>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <img
                    src={"/"+product.image}

                    alt={product.name}
                    className="w-full max-h-[400px] object-contain rounded shadow"
                />
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{product.name}</h1>
                        {userRole === 'admin' && (
                            <div className="relative">
                                <button
                                    onClick={toggleStatusDropdown}
                                    className="bg-yellow-500 text-white py-1 px-2 rounded text-sm hover:bg-yellow-600"
                                >
                                    Trạng thái: {currentStatus || 'Đang bán'} <i className="fa fa-caret-down ml-1"></i>
                                </button>
                                {showStatusDropdown && (
                                    <div className="absolute right-0 mt-1 w-32 bg-white shadow-md rounded-md z-10">
                                        <button
                                            onClick={() => handleStatusChange('Đang bán')}
                                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                        >
                                            Đang bán
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange('Ngừng bán')}
                                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                        >
                                            Ngừng bán
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange('Hết hàng')}
                                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                        >
                                            Hết hàng
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-4 text-justify">{product.description}</p>
                    <p className="text-xl font-semibold text-green-600 dark:text-green-400 mb-2">
                        Giá: {formatPrice(product.price)}
                    </p>
                    <p className="text-sm text-gray-500 mb-4">Danh mục: {product.category}</p>

                    <div className="flex gap-4">
                        {userRole !== 'admin' && (
                            <>
                                <button
                                    className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition"
                                    onClick={handleAddToCart}
                                >
                                    {addedToCart ? (
                                        <><i className="fa fa-check mr-2"></i>Đã thêm</>
                                    ) : (
                                        <><i className="fa fa-cart-plus mr-2"></i>Thêm vào giỏ</>
                                    )}
                                </button>
                                <button
                                    className="bg-gray-700 text-white w-full py-2 rounded hover:bg-gray-800 transition"
                                    onClick={handleBuyNow}
                                >
                                    Mua ngay
                                </button>
                            </>
                        )}
                        {userRole === 'admin' && (
                            <button
                                className="bg-yellow-600 text-white w-full py-2 rounded hover:bg-yellow-700 transition"
                                onClick={handleOpenUpdateModal}
                            >
                                Cập nhật sản phẩm
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {relatedProducts.length > 0 && (
                <div className="mt-10">
                    <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Sản phẩm tương tự</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {relatedProducts.map((item) => (
                            <Link
                                to={`/product/${item.id}`}
                                key={item.id}
                                className="block bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shadow hover:shadow-md transition"
                            >
                                <img src={"/"+item.image} alt={item.name} className="w-full h-40 object-contain" />
                                <div className="p-3">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{item.name}</h3>
                                    <p className="text-sm text-gray-500">{formatPrice(item.price)}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {showUpdateModal && (
                <UpdateProductModal
                    onClose={handleCloseUpdateModal}
                    product={product}
                    onProductUpdated={handleProductUpdated}
                />
            )}
        </div>
    );
};

export default ProductDetailPage;
