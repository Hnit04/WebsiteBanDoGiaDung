import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-10">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between">
                    {/* About Section */}
                    <div className="mb-6 md:mb-0 md:w-1/3">
                        <h4 className="text-lg font-bold mb-3">About Us</h4>
                        <p>Welcome to our website, a wonderful place to explore and learn how to cook like a pro.</p>
                        <div className="flex space-x-4 mt-3">
                            <a href="https://www.facebook.com" className="text-gray-400 hover:text-white"><i className="fab fa-facebook-f"></i></a>
                            <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-instagram"></i></a>
                            <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-twitter"></i></a>
                            <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-youtube"></i></a>
                        </div>
                    </div>

                    {/* Newsletter Section */}
                    <div className="mb-6 md:mb-0 md:w-1/3 mx-10">
                        <h4 className="text-lg font-bold mb-3">Subscribe</h4>
                        <div className="flex">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 p-2 rounded-l-lg border border-gray-500"
                            />
                            <button className="bg-pink-600 text-white p-2 rounded-r-lg hover:bg-pink-700">Send</button>
                        </div>
                    </div>

                    {/* Quick Links Section */}
                    <div className="md:w-1/3">
                        <h4 className="text-lg font-bold mb-3">Quick Links</h4>
                        <ul className="space-y-2    ">
                            <li><a href="#" className="text-gray-400 hover:text-white">Home</a></li>
                            <li><a href="#recipes" className="text-gray-400 hover:text-white">Recipes</a></li>
                            <li><a href="#about" className="text-gray-400 hover:text-white">Our Cooks</a></li>
                            <li><a href="#faq" className="text-gray-400 hover:text-white">FAQ</a></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-600 mt-6 pt-6 text-center text-gray-400">
                    <p>&copy; 2025 HomeCraft. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;