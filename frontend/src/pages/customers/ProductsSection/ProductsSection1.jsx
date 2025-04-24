import React from "react";
import { useContext, useEffect, useState } from "react";
import "./ProductsSection1.css";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faStar } from "@fortawesome/free-solid-svg-icons";
// import { faShoppingCart, faTimes } from "@fortawesome/free-solid-svg-icons";
import { CartContext } from "../CartContext/CartContext";
// import { getProducts } from "../../../assets/assets1";
// import { Link } from "react-router-dom";
import { ShopContext } from "../../../context/ShopContext";
import ProductsItem from "../ProductsItem";

const ProductsSection1 = () => {
  // const { addToCart } = useContext(CartContext);
  // const [products, setProducts] = useState([]);
  const { productsFeature} = useContext(ShopContext);

  const featureProducts8 = productsFeature.slice(0, 8);

  // useEffect(() => {
  //   getProducts().then((data) => {
  //     setProducts(data.slice(0, 8));
  //   });
  // }, []);

  

  return (
    <>
      <section id="product1" className="section-p1">
        <h2>Featured Products</h2>
        <p>Summer Collection New Morden Design</p>
        {featureProducts8.length > 0 ? (
          <div className="pro-container">
            {featureProducts8.map((product) => (
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
          <p>No featured products available at the moment.</p>
        )}
      </section>

    </>
  );
};

export default ProductsSection1;
