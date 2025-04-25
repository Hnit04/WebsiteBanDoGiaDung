import React from "react";
import "./CartTotals.css";
import { useCart } from "../CartContext/CartContext";
const CartTotals = () => {
  const { getTotalPrice } = useCart();
  const totalPrice = getTotalPrice();

  return (
    <>
      <section id="cart-add" class="section-p1">
        <div id="coupon">
          <h3>Apply Coupon</h3>
          <div>
            <input type="text" placeholder="Enter your coupon code" />
            <button class="normal">Apply</button>
          </div>
        </div>

        <div id="subtotal">
          <h3>Cart Totals</h3>
          <table>
            <tr>
              <td>Cart Subtotal</td>
              <td>{totalPrice.toLocaleString()} VNĐ</td>
            </tr>
            <tr>
              <td>Shipping</td>
              <td>Free</td>
            </tr>
            <tr>
              <td>
                <strong>Total</strong>
              </td>
              <td>
              <strong>{totalPrice.toLocaleString()} VNĐ</strong>
              </td>
            </tr>
          </table>
          <button class="normal">Proceed to checkout</button>
        </div>
      </section>
    </>
  );
};

export default CartTotals;
