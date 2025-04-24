import React from "react";
import "./CartCustomer.css";
import Header from "../../components/headerCustomer/HeaderCustomer";
import Footer from "../../components/footerCustomer/FooterCustomer";
import CartHeader from "./CartHeader/CartHeader";
import CartProducts from "./CartProducts/CartProducts";
import CartTotals from "./CartTotals/CartTotals";
const CartCustomer = () => {
    return (
        <>
        <Header />
        <CartHeader />
        <CartProducts />
        <CartTotals />




        <Footer />


        </>
    )
}

export default CartCustomer;