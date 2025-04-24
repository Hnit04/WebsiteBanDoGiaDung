import React from "react";
import HeaderCustomer from "../../components/headerCustomer/HeaderCustomer";
import FooterCustomer from "../../components/footerCustomer/FooterCustomer";
import SearchBar from "./SearchBar";
import ContactBanner from "./ContactBanner/ContactBanner";
import ContactContent from "./ContactContent/ContactContent";
const Contact = () => {
    return (
        <>
        <HeaderCustomer />
        <SearchBar />
        <ContactBanner />
        <ContactContent />

        <FooterCustomer />

        </>
    )
}

export default Contact;