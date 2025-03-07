import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-dark text-light py-5">
            <div className="container">
                <div className="row">
                    <div className="col-md-4">
                        <h4 className="h4 mb-3">HomeCraft</h4>
                        <p className="text-muted">
                            Nâng tầm không gian sống của bạn với những sản phẩm gia dụng chất lượng cao và thiết kế hiện đại.
                        </p>
                        <div className="d-flex gap-3">
                            <a href="https://www.facebook.com/tinh.cong.946179" className="text-muted"><i className="fab fa-facebook-f"></i></a>
                            <a href="#" className="text-muted"><i className="fab fa-instagram"></i></a>
                            <a href="#" className="text-muted"><i className="fab fa-twitter"></i></a>
                            <a href="#" className="text-muted"><i className="fab fa-youtube"></i></a>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <h4 className="h4 mb-3">Liên kết nhanh</h4>
                        <ul className="list-unstyled">
                            <li><a href="#" className="text-muted">Trang chủ</a></li>
                            <li><a href="#products" className="text-muted">Sản phẩm</a></li>
                            <li><a href="#about" className="text-muted">Giới thiệu</a></li>
                            <li><a href="#" className="text-muted">Liên hệ</a></li>
                            <li><a href="#" className="text-muted">Điều khoản dịch vụ</a></li>
                        </ul>
                    </div>
                    <div className="col-md-4">
                        <h4 className="h4 mb-3">Liên hệ</h4>
                        <ul className="list-unstyled">
                            <li className="d-flex align-items-start">
                                <i className="fas fa-map-marker-alt mt-1 me-2"></i>
                                <span className="text-muted">123 Đường Nguyễn Văn Linh, Quận 7, TP.HCM</span>
                            </li>
                            <li className="d-flex align-items-start">
                                <i className="fas fa-phone-alt mt-1 me-2"></i>
                                <span className="text-muted">0326829327</span>
                            </li>
                            <li className="d-flex align-items-start">
                                <i className="fas fa-envelope mt-1 me-2"></i>
                                <span className="text-muted">trancongtinh20042004@gmail.com</span>
                            </li>
                            <li className="d-flex align-items-start">
                                <i className="fas fa-clock mt-1 me-2"></i>
                                <span className="text-muted">8:00 - 20:00, Thứ 2 - Chủ nhật</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-top border-secondary mt-4 pt-4 text-center text-muted">
                    <p>&copy; 2025 Nhóm 14: Hệ thống giới thiệu và bán đồ gia dụng.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;