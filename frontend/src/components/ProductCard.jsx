import React from 'react';
import { formatPrice, generateRatingStars, getProductIcon } from '../assets/js/utils.jsx';

const ProductCard = ({ product, onClick }) => {
    return (
        <div
            className="card product-card overflow-hidden cursor-pointer"
            onClick={() => onClick(product)}
        >
            {/* <div className="bg-light h-48 d-flex align-items-center justify-content-center">
                <i className={`${getProductIcon(product)} fs-3 text-secondary`}></i>
            </div> */}
            <div className="card-body">
                <div><img src={product.image}/></div>
                <h3 className="card-title fw-medium">{product.name}</h3>
                <div className="d-flex align-items-center mb-2">
                    <div
                        className="text-warning me-2"
                        dangerouslySetInnerHTML={{ __html: generateRatingStars(product.rating) }}
                    ></div>
                    <span className="text-muted small">({product.reviewCount})</span>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                    <span className="fw-bold text-primary">{formatPrice(product.price)}</span>
                    <button
                        className="btn btn-sm btn-light rounded-circle"
                        onClick={(e) => {
                            e.stopPropagation();
                            onClick(product);
                        }}
                    >
                        <i className="fa fa-eye"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;