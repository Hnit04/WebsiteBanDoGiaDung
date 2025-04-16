import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';

// Component Chào mừng quay lại
const WelcomeBack = () => {
    return (
        <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-green-600">🎉 Welcome back!</h2>
            <p className="text-gray-600">It's great to have you back! We missed you.</p>
        </div>
    );
};

// Component hiển thị sau khi đăng nhập thành công
const SuccessLoginMessage = ({ username }) => {
    return (
        <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-green-600">🎉 Welcome, {username}!</h2>
            <p className="text-gray-600">You have successfully logged in.</p>
        </div>
    );
};

const ModalLogin = ({ onClose, onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [step, setStep] = useState('idle'); // 'idle' | 'loading' | 'success'
    const modalRef = useRef();

    const handleLogin = async () => {
        if (username.trim() && password.trim()) {
            setStep('loading');

            try {
                const res = await fetch('https://67ffd634b72e9cfaf7260bc4.mockapi.io/User');
                const data = await res.json();

                const foundUser = data.find(
                    (user) => user.username === username.trim() && user.password === password.trim()
                );

                if (foundUser) {
                    // Gọi pháo hoa khi đăng nhập thành công
                    confetti({
                        particleCount: 150,
                        spread: 100,
                        origin: { y: 0.6 }
                    });

                    setStep('success');
                    onLogin(foundUser.username);

                    setTimeout(() => {
                        onClose();
                    }, 3000);
                } else {
                    setStep('idle');
                    alert('Sai tài khoản hoặc mật khẩu!');
                }
            } catch (error) {
                console.error('Login error:', error);
                setStep('idle');
                alert('Đã có lỗi xảy ra, vui lòng thử lại.');
            }
        } else {
            alert('Vui lòng nhập đầy đủ username và password.');
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
        <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-50">
            <div
                ref={modalRef}
                className="bg-white p-6 rounded-xl shadow-xl w-200 max-w-full relative animate-fade-in"
            >
                <button
                    onClick={onClose}
                    className="absolute top-2 right-3 text-gray-400 hover:text-black text-lg"
                >
                    &times;
                </button>

                {step === 'idle' && (
                    <>
                        <h2 className="text-xl font-semibold text-pink-600 mb-4 text-center">
                            Login to HomeCraft
                        </h2>
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                            />
                            <button
                                onClick={handleLogin}
                                className="bg-pink-600 hover:bg-pink-700 text-white rounded-md px-4 py-2 w-full font-medium"
                            >
                                Login
                            </button>
                        </div>
                    </>
                )}

                {step === 'loading' && (
                    <div className="text-center">
                        <p className="text-gray-700 font-medium">Logging in...</p>
                        <div className="mt-4 animate-spin rounded-full h-8 w-8 border-t-2 border-pink-500 mx-auto"></div>
                    </div>
                )}

                {step === 'success' && (
                    <>
                        <SuccessLoginMessage username={username} />
                        <WelcomeBack /> {/* Hiển thị component Chào mừng quay lại */}
                    </>
                )}
            </div>
        </div>
    );
};

export default ModalLogin;
