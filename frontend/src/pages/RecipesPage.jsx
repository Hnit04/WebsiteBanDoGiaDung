import React, { useState } from "react";
import { recipes } from "../assets/js/recipesData";
import { useNavigate } from "react-router-dom";

const RecipesPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const navigate = useNavigate();

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.trim() === "") {
            setSearchResults([]);
            return;
        }

        const filtered = recipes.filter((recipe) =>
            recipe.title.toLowerCase().includes(value.toLowerCase())
        );
        setSearchResults(filtered);
    };

    const handleRecipeClick = (id) => {
        navigate(`/recipes/${id}`);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center text-orange-600">
                🧑‍🍳 Công Thức Nấu Ăn
            </h1>

            {/* Thanh tìm kiếm */}
            <div className="mb-6 max-w-md mx-auto relative">
                <input
                    type="text"
                    placeholder="Tìm công thức..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />

                {searchTerm && searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-md z-50 max-h-60 overflow-y-auto">
                        {searchResults.map((recipe) => (
                            <div
                                key={recipe.id}
                                className="p-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-3"
                                onClick={() => handleRecipeClick(recipe.id)}
                            >
                                <img
                                    src={recipe.image}
                                    alt={recipe.title}
                                    className="w-10 h-10 object-cover rounded"
                                />
                                <span className="text-sm text-gray-700">
                                    {recipe.title}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Danh sách công thức đầy đủ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {recipes.map((recipe) => (
                    <div
                        key={recipe.id}
                        className="bg-white rounded-2xl shadow-md overflow-hidden transition transform hover:scale-105 hover:shadow-xl cursor-pointer"
                        onClick={() => handleRecipeClick(recipe.id)}
                    >
                        <img
                            src={recipe.image}
                            alt={recipe.title}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <h2 className="text-lg font-semibold text-gray-800 mb-2">
                                {recipe.title}
                            </h2>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                {recipe.description}
                            </p>
                            <div className="flex justify-between text-sm text-gray-500 mb-2">
                                <span>⏱ {recipe.cookingTime}</span>
                                <span>🔥 {recipe.difficulty}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecipesPage;
