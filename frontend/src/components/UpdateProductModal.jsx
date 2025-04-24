import React, { useState, useEffect, useRef } from 'react';
import { updateProductData } from '../assets/js/productData'; // Import hàm cập nhật data

const UpdateProductModal = ({ onClose, product, onProductUpdated }) => {
    const modalRef = useRef();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (product) {
            setName(product.name);
            setDescription(product.description);
            setPrice(product.price);
            setImage(product.image);
            setCategory(product.category);
            setStatus(product.status);
        }
    }, [product]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const handleSubmit = () => {
        setLoading(true);
        setError(null);

        const updatedProduct = {
            id: product.id,
            name,
            description,
            price: parseFloat(price),
            image,
            category,
            status,
        };

        const success = updateProductData(updatedProduct); // Gọi hàm cập nhật data

        if (success) {
            setLoading(false);
            onProductUpdated(updatedProduct); // Gọi hàm cập nhật ở trang cha với dữ liệu mới
            onClose(); // Đóng modal sau khi thành công
        } else {
            setLoading(false);
            setError('Cập nhật sản phẩm thất bại.');
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center mx-auto">
            <div ref={modalRef} className="bg-white p-6 rounded-md shadow-lg w-200 border border-gray-800s">
                <h2 className="text-lg font-bold mb-4">Sửa sản phẩm</h2>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <div className="mb-3">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Tên sản phẩm:</label>
                    <input
                        type="text"
                        id="name"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Mô tả:</label>
                    <textarea
                        id="description"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">Giá:</label>
                    <input
                        type="number"
                        id="price"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">URL hình ảnh:</label>
                    <input
                        type="text"
                        id="image"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">Danh mục:</label>
                    <input
                        type="text"
                        id="category"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">Trạng thái:</label>
                    <select
                        id="status"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="Đang bán">Đang bán</option>
                        <option value="Ngừng bán">Ngừng bán</option>
                        <option value="Hết hàng">Hết hàng</option>
                    </select>
                </div>
                <div className="flex justify-end">
                    <button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2" disabled={loading}>
                        Hủy
                    </button>
                    <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" disabled={loading}>
                        {loading ? <i className="fa fa-spinner fa-spin"></i> : 'Lưu'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateProductModal;