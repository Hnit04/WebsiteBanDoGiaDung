import React from "react";
import { useContext } from "react";
import { CartContext } from "../CartContext/CartContext";
import "./CartProducts.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
const CartProducts = () => {
  const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext);

  const handleQuantityChange = (index, quantity) => {
    if (quantity < 1) return;
    updateQuantity(index, quantity);
  };
  return (
    <>
      <section id="cart" className="section-p1">
        <table width="100%">
          <thead>
            <tr>
              <td>Remove</td>
              <td>Image</td>
              <td>Product</td>
              <td>Size</td>
              <td>Price</td>
              <td>Quantity</td>
              <td>Subtotal</td>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item, index) => (
              <tr key={index}>
                <td>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faTimesCircle}
                      onClick={() => removeFromCart(index)}
                    />
                  </a>
                </td>
                <td>
                  <img src={Array.isArray(item.image) ? item.image[0] : item.image} alt={item.name} />
                </td>
                <td>{item.name}</td>
                <td>{item.selectedSize}</td>
                <td>{item.price.toLocaleString()} VNĐ</td>
                <td>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(index, parseInt(e.target.value))
                    }
                  />
                </td>
                <td>{(item.price * item.quantity).toLocaleString()} VNĐ</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default CartProducts;
