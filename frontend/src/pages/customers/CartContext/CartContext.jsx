// CartContext.jsx
import React, { createContext, useState, useContext } from 'react';
import Notification from '../Notification/Notification';

export const CartContext = createContext();
export const useCart = () => useContext(CartContext);
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [notification, setNotification] = useState(null);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existingProductIndex = prev.findIndex(item => item.id === product.id);
      if (existingProductIndex !== -1) {
        const updatedCartItems = [...prev];
        updatedCartItems[existingProductIndex].quantity += 1;
        return updatedCartItems;
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
    setNotification({ message: 'Add to cart successfully!', type: 'success' });
  };

  const removeFromCart = (index) => {
    setCartItems(prevItems => prevItems.filter((_, i) => i !== index));
    setNotification({ message: 'Remove the product from the cart successfully!', type: 'success' });
  }

  const updateQuantity = (index, quantity) => {
    setCartItems(prevItems => {
      const updatedCartItems = [...prevItems];
      updatedCartItems[index].quantity = quantity;
      return updatedCartItems;
    });
  };

  const getTotalQuantity = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };


  const closeNotification = () => {
    setNotification(null);
  }

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, getTotalQuantity, getTotalPrice }}>
      {children}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          duration={1000}
          onClose={closeNotification}
        />
      )}
    </CartContext.Provider>
  );
};