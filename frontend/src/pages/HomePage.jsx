import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

// Import hình ảnh
import img1 from "../assets/img.png";
import img2 from "../assets/img.png";
import img3 from "../assets/img.png";
import img4 from "../assets/img.png";

const HomePage = () => {
    const images = [img1, img2, img3, img4];

    return (
        <section
            className="hero-section d-flex justify-content-between px-5"
            style={{
                background: "linear-gradient(135deg, #ff9a9e, #fad0c4)",
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
            }}
        >
            <div className="container d-flex justify-content-between align-items-start">
                {/* Phần chữ - Chiếm 40% */}
                <div className="w-40 text-left">
                    <h1 className="fw-bold display-4 mb-3">
                        Thiết kế không gian sống
                    </h1>
                    <h2
                        className="fw-bold"
                        style={{
                            color: "#FFD700",
                            fontSize: "2rem",
                            textShadow: "1px 1px 4px rgba(0,0,0,0.3)",
                        }}
                    >
                        Hiện đại & Tinh tế
                    </h2>
                    <p className="lead mt-3">
                        Khám phá bộ sưu tập nội thất cao cấp giúp nâng tầm không gian sống của bạn.
                    </p>
                    <motion.a
                        href="#products"
                        className="btn btn-lg btn-light text-dark fw-bold px-4 py-2 mt-3"
                        whileHover={{ scale: 1.1, backgroundColor: "#ffffff" }}
                        whileTap={{ scale: 0.9 }}
                        style={{
                            borderRadius: "30px",
                            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                        }}
                    >
                        Mua sắm ngay
                    </motion.a>
                </div>

                {/* Ảnh - Chiếm 60% */}
                <div className="w-60 d-flex justify-content-end">
                    <Swiper
                        modules={[Pagination]}
                        slidesPerView={1}
                        pagination={{ clickable: true }}
                        style={{ maxWidth: "450px", borderRadius: "20px" }}
                    >
                        {images.map((img, index) => (
                            <SwiperSlide key={index}>
                                <motion.img
                                    src={img}
                                    alt={`Slide ${index + 1}`}
                                    className="img-fluid rounded shadow-lg"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 1 }}
                                    style={{
                                        borderRadius: "20px",
                                        boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                                    }}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
};

export default HomePage;
