import React from "react";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white-300 py-10">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Cột 1 */}
                    <div>
                        <h4 className="text-xl font-semibold mb-3 text-white">HomeCraft</h4>
                        <p className="text-gray-400">
                            Nâng tầm không gian sống của bạn với những sản phẩm gia dụng chất lượng cao và thiết kế hiện đại.
                        </p>
                        <div className="flex gap-4 mt-3">
                            <a href="https://www.facebook.com/tinh.cong.946179" className="text-gray-400 hover:text-white">
                                <i className="fab fa-facebook-f text-xl"></i>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white">
                                <i className="fab fa-instagram text-xl"></i>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white">
                                <i className="fab fa-twitter text-xl"></i>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white">
                                <i className="fab fa-youtube text-xl"></i>
                            </a>
                        </div>
                    </div>

                    {/* Cột 2 */}
                    <div>
                        <h4 className="text-xl font-semibold mb-3 text-white">Liên kết nhanh</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-white">Trang chủ</a></li>
                            <li><a href="#products" className="text-gray-400 hover:text-white">Sản phẩm</a></li>
                            <li><a href="#about" className="text-gray-400 hover:text-white">Giới thiệu</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Liên hệ</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Điều khoản dịch vụ</a></li>
                        </ul>
                    </div>

                    {/* Cột 3 */}
                    <div>
                        <h4 className="text-xl font-semibold mb-3 text-white">Liên hệ</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <i className="fas fa-map-marker-alt text-gray-400 mt-1 mr-2"></i>
                                <span className="text-gray-400">123 Đường Nguyễn Văn Linh, Quận 7, TP.HCM</span>
                            </li>
                            <li className="flex items-start">
                                <i className="fas fa-phone-alt text-gray-400 mt-1 mr-2"></i>
                                <span className="text-gray-400">0326829327</span>
                            </li>
                            <li className="flex items-start">
                                <i className="fas fa-envelope text-gray-400 mt-1 mr-2"></i>
                                <span className="text-gray-400">trancongtinh20042004@gmail.com</span>
                            </li>
                            <li className="flex items-start">
                                <i className="fas fa-clock text-gray-400 mt-1 mr-2"></i>
                                <span className="text-gray-400">8:00 - 20:00, Thứ 2 - Chủ nhật</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Phần bản quyền */}
                <div className="border-t border-gray-700 mt-6 pt-6 text-center text-gray-400">
                    <p>&copy; 2025 Nhóm 14: Hệ thống giới thiệu và bán đồ gia dụng.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
