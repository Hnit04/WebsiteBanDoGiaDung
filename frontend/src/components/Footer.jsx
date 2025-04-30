import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

const Footer = () => {
    return (
        <footer className="bg-white text-gray-800 py-10 border border-gray-200 show-sidebar">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between">
                    {/* About Section */}
                    <div className="mb-6 md:mb-0 md:w-1/3">
                        <h4 className="text-lg font-bold mb-3">Về chúng tôi</h4>
                        <p>
                            Chào mừng bạn đến với trang web của chúng tôi, một nơi tuyệt vời để khám phá và học cách nấu ăn như một
                            đầu bếp chuyên nghiệp.
                        </p>
                        <div className="flex space-x-4 mt-3">
                            <a href="https://www.facebook.com" className="text-gray-600 hover:text-gray-900">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="text-gray-600 hover:text-gray-900">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="text-gray-600 hover:text-gray-900">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="text-gray-600 hover:text-gray-900">
                                <Youtube size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Newsletter Section */}
                    <div className="mb-6 md:mb-0 md:w-1/3 mx-10">
                        <h4 className="text-lg font-bold mb-3">Đăng ký</h4>
                        <div className="flex">
                            <input
                                type="email"
                                placeholder="Nhập email của bạn"
                                className="flex-1 p-2 rounded-l-lg border border-gray-300 text-gray-800"
                            />
                            <button className="bg-pink-600 text-white p-2 rounded-r-lg hover:bg-pink-700"> Gửi </button>
                        </div>
                    </div>

                    {/* Quick Links Section */}
                    <div className="md:w-1/3">
                        <h4 className="text-lg font-bold mb-3">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="/" className="text-gray-600 hover:text-gray-900">
                                    Trang chủ
                                </a>
                            </li>
                            <li>
                                <a href="/products" className="text-gray-600 hover:text-gray-900">
                                    Sản phẩm
                                </a>
                            </li>
                            <li>
                                <a href="/contact" className="text-gray-600 hover:text-gray-900">
                                    Liên hệ
                                </a>
                            </li>
                            <li>
                                <a href="/FAQ" className="text-gray-600 hover:text-gray-900">
                                    FAQ
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-300 mt-6 pt-6 text-center text-gray-600">
                    <p>&copy; 2025 HomeCraft. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
