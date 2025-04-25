
import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "../../pages/customers/CartContext/CartContext";
import "./ProductsItem.css";
const ProductsItem = ({ id, image, name, price }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart({ id, image, name, price });
  };

  return (
    <div className="product-item">
      <Link to={`/product/${id}`}>
        <img
          src={Array.isArray(image) ? image[0] : image}
          alt={name}
          className="product-image"
        />
        <div className="product-details">
          {/* <span className="product-brand">adidas</span> */}
          <h5 className="product-name">{name}</h5>
          <div className="product-rating">
            <FontAwesomeIcon icon={faStar} />
            <FontAwesomeIcon icon={faStar} />
            <FontAwesomeIcon icon={faStar} />
            <FontAwesomeIcon icon={faStar} />
          </div>
          <h4 className="product-price">{price.toLocaleString()} VNĐ</h4>
        </div>
      </Link>
      <a href="#" onClick={handleAddToCart}>
        {/* <FontAwesomeIcon icon={faShoppingCart} className="cart-icon" /> */}
      </a>
    </div>
  );
};

export default ProductsItem;
