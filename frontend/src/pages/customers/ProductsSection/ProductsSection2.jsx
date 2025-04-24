import React from "react";
import { useContext, useEffect, useState } from "react";
import "./ProductsSection2.css";
// import { getProducts } from "../../../assets/assets2";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faStar } from "@fortawesome/free-solid-svg-icons";
// import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { CartContext } from "../CartContext/CartContext";
import { ShopContext } from "../../../context/ShopContext";
import ProductsItem from "../ProductsItem";
const ProductsSection2 = () => {
  // const { addToCart } = useContext(CartContext);
  // const [products, setProducts] = useState([]);
  const { productsBest } = useContext(ShopContext);
  //chỉ lấy 8 sản phẩm đầu tiên từ mảng bestsellerProducts
  const bestsellerProducts8 = productsBest.slice(0, 8);
  // useEffect(() => {
  //   getProducts().then((data) => {
  //     setProducts(data.slice(0, 8)); // Chỉ lấy 8 sản phẩm đầu tiên
  //   });
  // }, []);

  return (
    <>
      <section id="product1" className="section-p1">
        <h2>BestSeller</h2>
        <p>Summer Collection New Morden Design</p>
        
          {/* {products.map((product) => (
            <div className="pro" key={product.id}>
              <img src={product.image} alt="img" />
              <div className="des">
                <span>adidas</span>
                <h5>{product.name}</h5>
                <div className="star">
                  <FontAwesomeIcon icon={faStar} />
                  <FontAwesomeIcon icon={faStar} />
                  <FontAwesomeIcon icon={faStar} />
                  <FontAwesomeIcon icon={faStar} />
                  <FontAwesomeIcon icon={faStar} />
                </div>
                <h4>{product.price.toLocaleString()} VNĐ</h4>
              </div>
              <a href="#" onClick={(e) => {
                e.preventDefault();
              }}>
                <FontAwesomeIcon icon={faShoppingCart} className="sc" onClick={() => addToCart(product)} />
              </a>
            </div>
          ))} */}
        {bestsellerProducts8.length > 0 ? (
          <div className="pro-container">
            {bestsellerProducts8.map((product) => (
              <ProductsItem
                key={product.id}
                id={product.id}
                image={product.image}
                name={product.name}
                price={product.price}
              />
            ))}
          </div>
        ) : (
          <p>No best seller products available at the moment.</p>
        )}
      </section>
    </>
  );
};

export default ProductsSection2;
