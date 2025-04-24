import React, { useEffect } from "react";
import { useContext, useState } from "react";
import { ShopContext } from "../../context/ShopContext";
import { useParams } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useCart } from "./CartContext/CartContext";
import RelatedProducts from "./RelatedProducts";
import HeaderCustomer from "../../components/headerCustomer/HeaderCustomer";
import FooterCustomer from "../../components/footerCustomer/FooterCustomer";
import "./ProductsDetails.css";
const ProductsDetails = () => {
  const { productId } = useParams();
  const { products } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const { addToCart } = useCart();
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");

  const fetchProductData = async () => {
    products.map((item) => {
      if (item.id === productId) {
        setProductData(item);
        setImage(item.image[0]);
        return null;
      }
    });
  };

  const handleAddToCart = () => {
    if (!size) {
      alert("Please select a size first");
      return;
    }

    // Add product with selected size to cart
    const productWithSize = {
      ...productData,
      selectedSize: size,
    };
    addToCart(productWithSize);
  };

  useEffect(() => {
    fetchProductData();
  }, [productId]);

  return productData ? (
    <div className="product-D-container">
      <HeaderCustomer />
      <div className="product-D-content">
        <div className="product-D-images">
          <div className="thumbnails-container">
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className="thumbnail-img"
              />
            ))}
          </div>
          <div className="main-image-container">
            <img className="main-image" src={image} alt="" />
          </div>
        </div>

        <div className="product-info">
          <h1 className="product-title">{productData.name}</h1>
          <div className="rating-container">
            <img src={assets.star_icon} alt="" className="star-icon" />
            <img src={assets.star_icon} alt="" className="star-icon" />
            <img src={assets.star_icon} alt="" className="star-icon" />
            <img src={assets.star_icon} alt="" className="star-icon" />
            <img src={assets.star_dull_icon} alt="" className="star-icon" />
            <p className="rating-count">(122)</p>
          </div>
          <p className="productD-price">{productData.price} USD</p>
          <p className="product-description">{productData.description}</p>

          <div className="size-selector">
            <p>Select Size</p>
            <div className="size-buttons">
              {productData.sizes.map((item, index) => (
                <button
                  onClick={() => setSize(item)}
                  key={index}
                  className={`size-button ${item === size ? "selected" : ""}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleAddToCart} className="add-to-cart-btn">
            ADD TO CART
          </button>

          <hr className="divider" />

          <div className="product-features">
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      <div className="description-section">
        <div className="tab-header">
          <b className="tab active">Description</b>
          <p className="tab">Review (122)</p>
        </div>
        <div className="description-content">
          <p>
            An e-commerce website is an online platform that facilitates the
            buying and selling of products or services over the internet. It
            serves as a virual marketplace where businesses and individuals can
            showcase their products, interact with customers, and conduct
            transactions without the need for a physical presence. E-commerce
            websites have gained immense popularity due to their convenience,
            accessibility, and the global reach they offer.
          </p>
          <p>
            E-commerce websites typically display products or services along
            with detailed descriptions, images, prices, and any available
            variations. Each product usually has its own dedicated page with
            relevant information.
          </p>
        </div>
      </div>

      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
      <FooterCustomer />
    </div>
  ) : (
    <div className="loading"></div>
  );
};

export default ProductsDetails;
