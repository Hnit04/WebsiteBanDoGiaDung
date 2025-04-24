import React, { useState } from 'react';

const AddProductModal = ({ onClose }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('');

    const handleSubmit = () => {
        // Logic để thêm sản phẩm mới (gọi API, cập nhật dữ liệu)
        console.log('Thêm sản phẩm:', { name, description, price, image, category });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-md shadow-lg w-96">
                <h2 className="text-lg font-bold mb-4">Thêm sản phẩm mới</h2>
                <div className="mb-3">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Tên sản phẩm:</label>
                    <input type="text" id="name" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Mô tả:</label>
                    <textarea id="description" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">Giá:</label>
                    <input type="number" id="price" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">URL hình ảnh:</label>
                    <input type="text" id="image" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={image} onChange={(e) => setImage(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">Danh mục:</label>
                    <input type="text" id="category" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={category} onChange={(e) => setCategory(e.target.value)} />
                </div>
                <div className="flex justify-end">
                    <button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2">
                        Hủy
                    </button>
                    <button onClick={handleSubmit} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        Thêm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddProductModal;