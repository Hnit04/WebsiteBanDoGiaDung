import React from 'react';

const AboutPage = () => {
    return (
        <section id="about" className="py-10 bg-white">
            <div className="container mx-auto">
                <h2 className="text-center text-3xl font-semibold mb-4">Về HomeCraft</h2>
                <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/2 mb-6 md:mb-0">
                        <h3 className="text-xl font-semibold mb-3">Câu chuyện của chúng tôi</h3>
                        <p className="text-gray-600 mb-3">
                            HomeCraft được thành lập vào năm 2020 với sứ mệnh mang đến những sản phẩm gia dụng chất lượng cao,
                            thiết kế hiện đại và thân thiện với môi trường. Chúng tôi tin rằng mỗi ngôi nhà xứng đáng có những
                            sản phẩm tốt nhất, giúp cuộc sống hàng ngày trở nên dễ dàng và thú vị hơn.
                        </p>
                        <p className="text-gray-600">
                            Với đội ngũ chuyên gia thiết kế và kiểm soát chất lượng, chúng tôi cam kết mang đến những sản phẩm
                            gia dụng không chỉ đẹp mắt mà còn bền bỉ, an toàn và thân thiện với môi trường.
                        </p>
                    </div>
                    <div className="md:w-1/2">
                        <h3 className="text-xl font-semibold mb-3">Cam kết của chúng tôi</h3>
                        <ul className="list-none">
                            {[
                                "Sản phẩm chất lượng cao với bảo hành 12 tháng",
                                "Giao hàng nhanh chóng trong vòng 48 giờ",
                                "Chính sách đổi trả trong vòng 30 ngày",
                                "Tư vấn và hỗ trợ khách hàng 24/7",
                                "Sản phẩm thân thiện với môi trường"
                            ].map((item, index) => (
                                <li key={index} className="flex items-start mb-2">
                                    <i className="fa fa-check-circle text-blue-500 mt-1 mr-2"></i>
                                    <span className="text-gray-600">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutPage;