import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import './RightSidebar.css';

const RightSidebar = () => {
    const [isCatalogDropOn, setCatalogDrop] = useState({
        category: false,
    });
    const [selectedCategory, setSelectedCategory] = useState(''); // New state for selected category

    const toggleCatalogDropdown = (category) => {
        setCatalogDrop((prevState) => ({
            ...prevState,
            [category]: !prevState[category],
        }));
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category); // Update the selected category
    };

    return (
        <div className="right-sidebar">
            <label>Chọn danh mục</label>

            <div className="category">
                <div className="dropdown-header" onClick={() => toggleCatalogDropdown('category')}>
                    Đối tượng
                    <FaChevronDown className={`chevron-icon ${isCatalogDropOn.category ? 'open' : ''}`} />
                </div>
                {isCatalogDropOn.category && (
                    <ul className="dropdown-content show">
                        {['Men', 'Women', 'Kids'].map((category) => (
                            <li key={category}>
                                <input
                                    type="checkbox"
                                    checked={selectedCategory === category}
                                    onChange={() => handleCategoryChange(category)}
                                />
                                {category}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default RightSidebar;
