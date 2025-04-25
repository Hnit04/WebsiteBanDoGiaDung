import React, { useState, useEffect, useRef } from 'react';
import confetti from "canvas-confetti";

const ModalLogin = ({ onClose, onLogin }) => {
    const [form, setForm] = useState({
        username: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState('idle'); // 'idle' | 'success'
    const modalRef = useRef();

    const validate = () => {
        const newErrors = {};

        if (!form.username.trim()) newErrors.username = 'Username không được để trống';
        if (!form.password.trim()) newErrors.password = 'Password không được để trống';

        return newErrors;
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const handleSubmit = async () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch('https://67ffd634b72e9cfaf7260bc4.mockapi.io/User');
            const users = await res.json();

            const user = users.find(u => u.username === form.username && u.password === form.password);
            let userRole = 'customer'; // Giá trị mặc định

            if (user) {
                userRole = user.role; // Lấy role từ dữ liệu người dùng API
                onLogin(form.username, userRole); // Truyền role chính xác
                setStep('success');
                confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
                setTimeout(() => {
                    onClose();
                }, 3000);
            } else {
                setErrors({ username: 'Thông tin đăng nhập không chính xác' });
            }
        } catch (error) {
            console.error('Đăng nhập thất bại:', error);
            alert('Có lỗi xảy ra, vui lòng thử lại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClickOutside = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
            <div ref={modalRef} className="bg-white p-6 rounded-xl shadow-xl w-200 max-w-full relative animate-fade-in">
                <button onClick={onClose} className="absolute top-2 right-3 text-gray-400 hover:text-black text-lg">
                    &times;
                </button>

                {step === 'idle' && (
                    <>
                        <h2 className="text-xl font-bold text-center text-pink-600 mb-4">Login to HomeCraft</h2>
                        <div className="space-y-3">
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={form.username}
                                onChange={handleChange}
                                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                            />
                            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}

                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={form.password}
                                onChange={handleChange}
                                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                            />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="bg-pink-600 hover:bg-pink-700 text-white rounded-md px-4 py-2 w-full font-medium"
                            >
                                {isSubmitting ? 'Submitting...' : 'Login'}
                            </button>
                        </div>
                    </>
                )}

                {step === 'success' && (
                    <div className="text-center space-y-4">
                        <h2 className="text-2xl font-bold text-green-600">🎉 Chào mừng bạn đến với HomeCraft!</h2>
                        <p className="text-gray-600">Bạn đã đăng nhập thành công.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ModalLogin;