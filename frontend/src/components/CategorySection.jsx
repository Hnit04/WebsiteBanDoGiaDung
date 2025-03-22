import React from 'react';

const CategorySection = ({ onCategorySelect }) => {
    const categories = [
        { id: 'kitchen', name: 'Nhà bếp', icon: 'fa fa-utensils' },
        { id: 'bathroom', name: 'Phòng tắm', icon: 'fa fa-shower' },
        { id: 'bedroom', name: 'Phòng ngủ', icon: 'fa fa-bed' },
        { id: 'livingroom', name: 'Phòng khách', icon: 'fa fa-couch' }
    ];

    return (
        <section id="categories" className="py-12 text-black bg-white">
            <div className="container px-4">
                <h2 className="text-center h2 mb-4">Danh mục sản phẩm</h2>
                <div className="row row-cols-2 row-cols-md-4 g-4">
                    {categories.map(category => (
                        <div
                            key={category.id}
                            className="col category-card bg-light p-4 rounded text-center cursor-pointer"
                            onClick={() => onCategorySelect(category.id)}
                        >
                            <i className={`${category.icon} fs-1 text-primary mb-4`}></i>
                            <h3 className="fw-medium">{category.name}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategorySection;