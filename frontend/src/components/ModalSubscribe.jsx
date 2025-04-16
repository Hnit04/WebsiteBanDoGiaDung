import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';

const ModalSubscribe = ({ onClose, onLogin }) => {
    const [form, setForm] = useState({
        username: '',
        password: '',
        email: '',
        fullName: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState('idle'); // 'idle' | 'success'
    const modalRef = useRef();

    const validate = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!form.username.trim()) newErrors.username = 'Username không được để trống';
        if (!form.password.trim()) newErrors.password = 'Password không được để trống';
        if (!form.fullName.trim()) newErrors.fullName = 'Full name không được để trống';
        if (!emailRegex.test(form.email.trim())) newErrors.email = 'Email không hợp lệ';

        return newErrors;
    };

    const handleBlur = async (e) => {
        const { name, value } = e.target;
        if (!value.trim()) return;

        try {
            const res = await fetch('https://67ffd634b72e9cfaf7260bc4.mockapi.io/User');
            const users = await res.json();

            if (name === 'username') {
                const exists = users.some(u => u.username === value.trim());
                if (exists) {
                    setErrors(prev => ({ ...prev, username: 'Username đã tồn tại' }));
                }
            }

            if (name === 'email') {
                const exists = users.some(u => u.email === value.trim());
                if (exists) {
                    setErrors(prev => ({ ...prev, email: 'Email đã được sử dụng' }));
                }
            }
        } catch (error) {
            console.error('Lỗi kiểm tra:', error);
        }
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

            const usernameExists = users.some(u => u.username === form.username);
            const emailExists = users.some(u => u.email === form.email);

            if (usernameExists || emailExists) {
                setErrors({
                    username: usernameExists ? 'Username đã tồn tại' : '',
                    email: emailExists ? 'Email đã được sử dụng' : ''
                });
                setIsSubmitting(false);
                return;
            }

            await fetch('https://67ffd634b72e9cfaf7260bc4.mockapi.io/User', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });

            setStep('success');
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });

            setTimeout(() => {
                onLogin(form.username); // tự động đăng nhập
                onClose(); // đóng modal
            }, 3000);
        } catch (error) {
            console.error('Đăng ký thất bại:', error);
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
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
            <div ref={modalRef} className="bg-white p-6 rounded-xl shadow-xl w-200 max-w-full relative animate-fade-in">
                <button onClick={onClose} className="absolute top-2 right-3 text-gray-400 hover:text-black text-lg">
                    &times;
                </button>

                {step === 'idle' && (
                    <>
                        <h2 className="text-xl font-bold text-center text-pink-600 mb-4">Subscribe to HomeCraft</h2>
                        <div className="space-y-3">
                            <input
                                type="text"
                                name="fullName"
                                placeholder="Full Name"
                                value={form.fullName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                            />
                            {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}

                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={form.username}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                            />
                            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}

                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={form.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

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
                                {isSubmitting ? 'Submitting...' : 'Subscribe'}
                            </button>
                        </div>
                    </>
                )}

                {step === 'success' && (
                    <div className="text-center space-y-4">
                        <h2 className="text-2xl font-bold text-green-600">🎉 Chào mừng bạn đến với HomeCraft!</h2>
                        <p className="text-gray-600">Tài khoản của bạn đã được tạo thành công.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ModalSubscribe;
