import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { recipes } from "../assets/js/recipesData";

const RecipesDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const recipe = recipes.find((r) => r.id === parseInt(id));

    if (!recipe) {
        return (
            <div className="text-center p-10 text-red-600 font-semibold text-xl">
                Không tìm thấy công thức nấu ăn.
            </div>
        );
    }

    return (
        <div className="max-w-300 mx-auto border border-gray-300 rounded shadow-2xl px-5 py-5">
            <button
                className="hover:text-black"
                onClick={() => navigate(-1)}
            >
                ← Quay lại
            </button>

            <h1 className="text-3xl font-bold mb-4 text-gray-800">{recipe.title}</h1>

            <img
                src={recipe.image}
                alt={recipe.title}
                className="w-120 h-64 object-cover rounded-xl mb-6"
            />

            <div className="text-gray-700 leading-relaxed mb-4">
                <p className="mb-2">
                    <strong>⏱ Thời gian nấu:</strong> {recipe.cookingTime}
                </p>
                <p className="mb-2">
                    <strong>🔥 Độ khó:</strong> {recipe.difficulty}
                </p>
                <p className="mb-4">
                    <strong>📜 Mô tả:</strong> {recipe.description}
                </p>

                <h2 className="text-xl font-semibold mb-2">🛒 Nguyên liệu:</h2>
                <ul className="list-disc list-inside mb-4">
                    {recipe.ingredients.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>

                <h2 className="text-xl font-semibold mb-2">👨‍🍳 Các bước thực hiện:</h2>
                <ol className="list-decimal list-inside space-y-2 text-justify">
                    {recipe.steps.map((step, index) => (
                        <li key={index}>{step}</li>
                    ))}
                </ol>
            </div>
        </div>
    );
};

export default RecipesDetailPage;
