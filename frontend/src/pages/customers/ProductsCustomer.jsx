import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { ShopContext } from "../../context/ShopContext";
import HeaderCustomer from "../../components/headerCustomer/HeaderCustomer";
import FooterCustomer from "../../components/footerCustomer/FooterCustomer";
import Title from "./Title";
import { assets } from "../../assets/assets";
import ProductsItem from "./ProductsItem";
import SearchBar from "./SearchBar";
import "./ProductsCustomer.css";

const ProductsCustomer = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter] = useState(true);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState([]);

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSubCategory((prev) => [...prev, e.target.value]);
    }
  };

  const applyFiler = () => {
    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((product) =>
        category.includes(product.category)
      );
    }
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((product) =>
        subCategory.includes(product.subCategory)
      );
    }
    setFilterProducts(productsCopy);
  };

  const sortProducts = () => {
    let fpCopy = filterProducts.slice();

    switch (sortType) {
      case "low-high":
        setFilterProducts(fpCopy.sort((a, b) => a.price - b.price));
        break;
      case "high-low":
        setFilterProducts(fpCopy.sort((a, b) => b.price - a.price));
        break;
      default:
        applyFiler();
        break;
    }
  };

  useEffect(() => {
    applyFiler();
  }, [category, subCategory, search, showSearch]);

  useEffect(() => {
    sortProducts();
  }, [sortType]);

  return (
    <>
      <HeaderCustomer />
      <SearchBar />
      <div className="products-layout">
        {/* Filter Options */}
        <div className="filter-section">
          <p className="filter-title">FILTERS</p>
          {/* Filter by Category */}
          <div className={`filter-box ${showFilter ? "" : "hidden"}`}>
            <p className="filter-heading">CATEGORIES</p>
            <div className="filter-options">
              <p className="filter-option">
                <input
                  className="filter-checkbox"
                  type="checkbox"
                  value={"Men"}
                  onChange={toggleCategory}
                />
                Men
              </p>
              <p className="filter-option">
                <input
                  className="filter-checkbox"
                  type="checkbox"
                  value={"Women"}
                  onChange={toggleCategory}
                />
                Women
              </p>
              <p className="filter-option">
                <input
                  className="filter-checkbox"
                  type="checkbox"
                  value={"Kids"}
                  onChange={toggleCategory}
                />
                Kids
              </p>
            </div>
          </div>
          {/* SubCategory Filter */}
          <div className={`filter-box ${showFilter ? "" : "hidden"}`}>
            <p className="filter-heading">TYPE</p>
            <div className="filter-options">
              <p className="filter-option">
                <input
                  className="filter-checkbox"
                  type="checkbox"
                  value={"Topwear"}
                  onChange={toggleSubCategory}
                />
                Topwear
              </p>
              <p className="filter-option">
                <input
                  className="filter-checkbox"
                  type="checkbox"
                  value={"Bottomwear"}
                  onChange={toggleSubCategory}
                />
                Bottomwear
              </p>
              <p className="filter-option">
                <input
                  className="filter-checkbox"
                  type="checkbox"
                  value={"Winterwear"}
                  onChange={toggleSubCategory}
                />
                Winterwear
              </p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="products-section">
          <div className="products-header">
            <Title text1={"All"} text2={"COLLECTIONS"} />
            <select
              onChange={(e) => setSortType(e.target.value)}
              className="sort-select"
            >
              <option value="relavent">Sort by: Relavent</option>
              <option value="low-high">Sort by: Low to High</option>
              <option value="high-low">Sort by: High to Low</option>
            </select>
          </div>

          {/* Map Products */}
          <div className="productsC-grid">
            {filterProducts.map((item) => (
              <ProductsItem
                key={item.id}
                id={item.id}
                image={item.image}
                name={item.name}
                price={item.price}
              />
            ))}
          </div>
        </div>
      </div>
      <FooterCustomer />
    </>
  );
};

export default ProductsCustomer;
