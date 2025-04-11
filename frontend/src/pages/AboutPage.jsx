import React from "react";
import { CheckCircle } from "lucide-react";

const AboutPage = () => {
    return (
        <section id="about" className="py-12 bg-white">
            <div className="container mx-auto px-6">
                <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">Về HomeCraft</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Câu chuyện của chúng tôi */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-4">Câu chuyện của chúng tôi</h3>
                        <p className="text-gray-600 mb-3">
                            HomeCraft được thành lập vào năm 2020 với sứ mệnh mang đến những sản phẩm gia dụng chất lượng cao, thiết kế hiện đại và thân thiện với môi trường.
                            Chúng tôi tin rằng mỗi ngôi nhà xứng đáng có những sản phẩm tốt nhất, giúp cuộc sống hàng ngày trở nên dễ dàng và thú vị hơn.
                        </p>
                        <p className="text-gray-600">
                            Với đội ngũ chuyên gia thiết kế và kiểm soát chất lượng, chúng tôi cam kết mang đến những sản phẩm gia dụng không chỉ đẹp mắt mà còn bền bỉ, an toàn và thân thiện với môi trường.
                        </p>
                    </div>

                    {/* Cam kết của chúng tôi */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-4">Cam kết của chúng tôi</h3>
                        <ul className="space-y-3">
                            {[
                                "Sản phẩm chất lượng cao với bảo hành 12 tháng",
                                "Giao hàng nhanh chóng trong vòng 48 giờ",
                                "Chính sách đổi trả trong vòng 30 ngày",
                                "Tư vấn và hỗ trợ khách hàng 24/7",
                                "Sản phẩm thân thiện với môi trường",
                            ].map((item, index) => (
                                <li key={index} className="flex items-start">
                                    <CheckCircle className="text-blue-600 w-5 h-5 mt-1 mr-2" />
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
