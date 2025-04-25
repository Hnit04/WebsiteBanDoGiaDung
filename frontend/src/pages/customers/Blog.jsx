import React from "react";
import HeaderCustomer from "../../components/headerCustomer/HeaderCustomer";
import FooterCustomer from "../../components/footerCustomer/FooterCustomer";
import BlogBanner from "./BlogBanner/BlogBanner";
import BlogContent from "./BlogContent/BlogContent";
import NewLetterSection from "./NewLetterSection/NewLetterSection";
import SearchBar from "./SearchBar";
const Blog = () => {
    return (
        <>
        <HeaderCustomer />
        <SearchBar />
        <BlogBanner />
        <BlogContent />


                

  
        <NewLetterSection />
        <FooterCustomer />
        </>
    )
}

export default Blog;