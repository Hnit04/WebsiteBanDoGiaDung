import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

// Import images
import img1 from "../assets/img.png";
import img2 from "../assets/img.png";
import img3 from "../assets/img.png";
import img4 from "../assets/img.png";

const HomePage = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const images = [img1, img2, img3, img4];

    return (
        <section className="hero-section text-white flex items-center" style={{ background: "linear-gradient(135deg, #ff9a9e, #fad0c4)", minHeight: "45vh", padding: "50px 0" }}>
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row items-center">
                    {/* Text Section */}
                    <div className="md:w-1/2 mb-6 md:mb-0">
                        <h1 className="font-bold text-4xl mb-3">Thiết kế không gian sống</h1>
                        <h2 className="font-bold text-2xl text-yellow-400 text-shadow-md mb-3">Hiện đại & Tinh tế</h2>
                        <p className="text-lg mt-3 py-5">Khám phá bộ sưu tập nội thất cao cấp giúp nâng tầm không gian sống của bạn.</p>
                        <motion.a
                            href="#products"
                            className="btn btn-lg bg-white text-pink-600 font-bold px-4 py-2 mt-3 rounded-full shadow-md"
                            whileHover={{ scale: 1.1, backgroundColor: "#ffffff" }}
                            whileTap={{ scale: 0.9 }}
                        >
                            Mua sắm ngay
                        </motion.a>
                    </div>

                    {/* Image Slider Section */}
                    <div className="md:w-1/2 flex justify-center">
                        <Swiper
                            modules={[Pagination]}
                            slidesPerView={1}
                            pagination={{
                                clickable: true,
                                renderBullet: (index, className) => {
                                    return `<span class="${className}" style="background: ${index === activeIndex ? '#FFD700' : '#fff'}; width: 12px; height: 12px; border-radius: 50%; margin: 5px; cursor: pointer;"></span>`;
                                },
                            }}
                            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                            style={{ maxWidth: "400px", borderRadius: "20px" }}
                        >
                            {images.map((img, index) => (
                                <SwiperSlide key={index}>
                                    <motion.img
                                        src={img}
                                        alt={`Slide ${index + 1}`}
                                        className="img-fluid rounded-lg shadow-lg"
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ duration: 1 }}
                                        style={{ borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HomePage;