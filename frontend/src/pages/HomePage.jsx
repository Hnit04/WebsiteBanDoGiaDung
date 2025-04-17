"use client"

import { useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { motion } from "framer-motion"
import "swiper/css"
import "swiper/css/pagination"
import { Pagination } from "swiper/modules"

// Import images
import img1 from "../assets/img.png"
import img2 from "../assets/img.png"
import img3 from "../assets/img.png"
import img4 from "../assets/img.png"

const HomePage = () => {
    const [activeIndex, setActiveIndex] = useState(0)
    const images = [img1, img2, img3, img4]

    return (
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
                            href="#products"
                            className="inline-flex items-center justify-center px-6 py-3 mt-3 font-medium bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
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
                                    return `<span class="${className}" style="background: ${index === activeIndex ? "#FFF" : "rgba(255,255,255,0.5)"}; width: 10px; height: 10px; border-radius: 50%; margin: 5px; cursor: pointer;"></span>`
                                },
                            }}
                            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                            style={{ maxWidth: "450px", width: "100%" }}
                            className="rounded-lg overflow-hidden"
                        >
                            {images.map((img, index) => (
                                <SwiperSlide key={index}>
                                    <motion.div
                                        className="p-2"
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <img
                                            src={img || "/placeholder.svg"}
                                            alt={`Nội thất ${index + 1}`}
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
            </div>
        </section>
    )
}

export default HomePage
