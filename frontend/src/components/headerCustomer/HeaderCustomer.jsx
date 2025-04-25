import React, { useContext } from "react";
import { NavLink} from "react-router-dom";
import "./HeaderCustomer.css";
import avatar from "../../assets/img/about/avatar.jpg";
import logo from "../../assets/LogoWeb.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "../../pages/customers/CartContext/CartContext";
import { assets } from "../../assets/assets";
import { ShopContext } from "../../context/ShopContext";


const HeaderCustomer = () => {
  const { getTotalQuantity } = useCart();
  const totalQuantity = getTotalQuantity();

  const { setShowSearch } = useContext(ShopContext);




  return (
    <section id="header">
      <NavLink to="/">
        <img src={logo} className="logo" alt="Logo" />
      </NavLink>
      <div>
        <ul id="navbar">
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/shop">Shop</NavLink>
          </li>
          <li>
            <NavLink to="/blog">Blog</NavLink>
          </li>
          <li>
            <NavLink to="/about">About</NavLink>
          </li>
          <li>
            <NavLink to="/contact">Contact</NavLink>
          </li>
          <li>
            <NavLink to="/login">Login</NavLink>
          </li>
          <li id="lg-bag">
            <NavLink to="/cart">
              <FontAwesomeIcon icon={faShoppingBag} />
              {totalQuantity > 0 && (
                <span className="cart-badge">{totalQuantity}</span>
              )}
            </NavLink>
          </li>
          <li>
            <img
              onClick={() => setShowSearch(true)}
              src={assets.search_icon}
              className="search-icon"
              alt="search"
            />
          </li>
          <li>
            <NavLink to="/profileCustomer" className="link-button">
              <img src={avatar} alt="avt" className="avatar" />
            </NavLink>
            
          </li>
          <a href="#" id="close">
            <i className="far fa-times"></i>
          </a>
        </ul>
      </div>
      <div id="mobile">
        <NavLink to="/cart">
          <i className="far fa-shopping-bag"></i>
        </NavLink>
        <i id="bar" className="fas fa-outdent"></i>
      </div>
    </section>
  );
};

export default HeaderCustomer;
