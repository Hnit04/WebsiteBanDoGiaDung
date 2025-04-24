
import { createContext, useState } from "react";
import { products } from "../assets/assets";
export const ShopContext = createContext();
const ShopContextProvider = (props) => {
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const productsBest = products.filter(products => products?.bestseller === true);
  const productsFeature = products.filter(products => products?.feature === true);
  const value = {
    products,productsBest,productsFeature, search, setSearch, showSearch, setShowSearch
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
