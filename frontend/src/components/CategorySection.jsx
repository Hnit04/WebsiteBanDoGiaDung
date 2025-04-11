import React from 'react';

const CategorySection = ({ onCategorySelect }) => {
    const categories = [
        { id: 'kitchen', name: 'Nhà bếp', icon: 'fa fa-utensils' },
        { id: 'bathroom', name: 'Phòng tắm', icon: 'fa fa-shower' },
        { id: 'bedroom', name: 'Phòng ngủ', icon: 'fa fa-bed' },
        { id: 'livingroom', name: 'Phòng khách', icon: 'fa fa-couch' }
    ];

    return (
        <section id="categories" className="py-12 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-center text-3xl font-semibold mb-4">Danh mục sản phẩm</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {categories.map(category => (
                        <div
                            key={category.id}
                            className="category-card bg-gray-100 p-6 rounded-lg text-center cursor-pointer transition-transform transform hover:scale-105"
                            onClick={() => onCategorySelect(category.id)}
                        >
                            <i className={`${category.icon} text-4xl text-blue-500 mb-4`}></i>
                            <h3 className="text-lg font-medium">{category.name}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategorySection;