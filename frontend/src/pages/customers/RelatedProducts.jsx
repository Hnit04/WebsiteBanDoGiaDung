import React, { useEffect } from "react";
import { ShopContext } from "../../context/ShopContext";
import { useContext, useState } from "react";
import Title from "./Title";
import ProductsItem from "./ProductsItem";
import './RelatedProducts.css';
const RelatedProducts = ({ category, subCategory }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.slice();

      productsCopy = productsCopy.filter((item) => category === item.category);
      productsCopy = productsCopy.filter(
        (item) => subCategory === item.subCategory
      );

      setRelated(productsCopy.slice(0, 5));
    }
  }, [products]);

  return (
    <div className="related-container">
      <div className="related-title">
        <Title text1={"RELATED"} text2={"PRODUCTS"} />
      </div>
      <div className="products-grid">
        {related.map((item, index) => (
          <ProductsItem
            key={index}
            id={item.id}
            image={item.image}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
