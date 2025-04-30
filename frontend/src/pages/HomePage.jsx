import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/pagination";
import { Link } from 'react-router-dom';
import { Pagination, Autoplay } from "swiper/modules"; // Thêm Autoplay
import "swiper/css";
import "swiper/css/pagination";


// Import product data (assuming you have productData.js in the same directory)
import { products } from '../assets/js/productData.jsx';
// Import placeholder image (optional)
import placeholderImage from "../assets/img.png";


const HomePage = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    // Select a few products for the hero slider
    const heroProducts = products.slice(0, 4);

    return (
        <div>
            <section
                className="hero-section text-white flex items-center"
                style={{
                    background: "#000000",
                    minHeight: "45vh",
                    padding: "50px 0",
                }}
            >
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center">
                        {/* Text Section */}
                        <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
                            <h1 className="font-bold text-4xl mb-3">Thiết kế không gian sống</h1>
                            <h2 className="font-bold text-2xl text-blue-500 mb-3">Hiện đại & Tinh tế</h2>
                            <p className="text-lg mt-3 py-3 opacity-90">
                                Khám phá bộ sưu tập nội thất cao cấp giúp nâng tầm không gian sống của bạn.
                            </p>
                            <motion.a
                                href="/products"
                                className="inline-flex items-center justify-center px-6 py-3 mt-3 font-medium bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Mua sắm ngay
                            </motion.a>
                        </div>

                        {/* Image Slider Section */}
                        <Swiper
                            modules={[Pagination, Autoplay]} // Thêm Autoplay vào modules
                            slidesPerView={1}
                            spaceBetween={10}
                            loop={true} // Cho phép lặp lại
                            autoplay={{
                                delay: 3000, // thời gian giữa các slide (ms)
                                disableOnInteraction: false, // không tắt autoplay khi người dùng tương tác
                            }}
                            pagination={{
                                clickable: true,
                                renderBullet: (index, className) => {
                                    return `<span class="${className}" style="background: ${
                                        index === activeIndex ? "#FFF" : "rgba(255,255,255,0.5)"
                                    }; width: 10px; height: 10px; border-radius: 50%; margin: 5px; cursor: pointer;"></span>`;
                                },
                            }}
                            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                            style={{ maxWidth: "450px", width: "100%" }}
                            className="rounded-lg overflow-hidden"
                        >
                            {heroProducts.map((product) => (
                                <SwiperSlide key={product.id}>
                                    <motion.div
                                        className="p-2"
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <img
                                            src={placeholderImage}
                                            alt={product.name}
                                            className="w-full h-auto rounded-lg shadow-lg"
                                            style={{
                                                borderRadius: "12px",
                                                boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)",
                                                border: "4px solid #333333",
                                            }}
                                        />
                                    </motion.div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </section>

            {/* Product Listing Section */}
            <section className="py-12 bg-gray-200">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Sản phẩm nổi bật</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <Link
                                to={`/product/${product.id}`}
                                key={product.id}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
                            >
                                <div className="relative">
                                    <img
                                        src={product.image || placeholderImage}
                                        alt={product.name}
                                        className="w-full h-48 object-contain"
                                    />
                                    <span
                                        className="absolute top-2 left-2 bg-green-500 text-white text-sm font-semibold rounded-md px-2 py-1">
                                        {product.category}
                                    </span>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">{product.name}</h3>
                                    <p className="text-gray-600 text-sm mb-3">
                                        {product.description.substring(0, 60)}...
                                    </p>
                                    <div className="flex items-center justify-between">
                                    <span className="text-red-500 font-bold text-xl">
                                        {new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(product.price)}
                                    </span>
                                        <button
                                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md">
                                            Thêm vào giỏ
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                </div>
            </section>
        </div>
    );
};

export default HomePage;