import React from 'react';

const AboutPage = () => {
    return (
        <section id="about" className="py-5 bg-white">
            <div className="container">
                <h2 className="text-center h3 mb-4">Về HomeCraft</h2>
                <div className="row">
                    <div className="col-md-6">
                        <h3 className="h5 mb-3">Câu chuyện của chúng tôi</h3>
                        <p className="text-muted mb-3">
                            HomeCraft được thành lập vào năm 2020 với sứ mệnh mang đến những sản phẩm gia dụng chất lượng cao,
                            thiết kế hiện đại và thân thiện với môi trường. Chúng tôi tin rằng mỗi ngôi nhà xứng đáng có những
                            sản phẩm tốt nhất, giúp cuộc sống hàng ngày trở nên dễ dàng và thú vị hơn.
                        </p>
                        <p className="text-muted">
                            Với đội ngũ chuyên gia thiết kế và kiểm soát chất lượng, chúng tôi cam kết mang đến những sản phẩm
                            gia dụng không chỉ đẹp mắt mà còn bền bỉ, an toàn và thân thiện với môi trường.
                        </p>
                    </div>
                    <div className="col-md-6">
                        <h3 className="h5 mb-3">Cam kết của chúng tôi</h3>
                        <ul className="list-unstyled">
                            <li className="d-flex align-items-start mb-2">
                                <i className="fa fa-check-circle text-primary mt-1 me-2"></i>
                                <span className="text-muted">Sản phẩm chất lượng cao với bảo hành 12 tháng</span>
                            </li>
                            <li className="d-flex align-items-start mb-2">
                                <i className="fa fa-check-circle text-primary mt-1 me-2"></i>
                                <span className="text-muted">Giao hàng nhanh chóng trong vòng 48 giờ</span>
                            </li>
                            <li className="d-flex align-items-start mb-2">
                                <i className="fa fa-check-circle text-primary mt-1 me-2"></i>
                                <span className="text-muted">Chính sách đổi trả trong vòng 30 ngày</span>
                            </li>
                            <li className="d-flex align-items-start mb-2">
                                <i className="fa fa-check-circle text-primary mt-1 me-2"></i>
                                <span className="text-muted">Tư vấn và hỗ trợ khách hàng 24/7</span>
                            </li>
                            <li className="d-flex align-items-start mb-2">
                                <i className="fa fa-check-circle text-primary mt-1 me-2"></i>
                                <span className="text-muted">Sản phẩm thân thiện với môi trường</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutPage;