import React from 'react';
import './HomeCustomer.css';
import Header from '../../components/headerCustomer/HeaderCustomer';
import HeroSection from '../../pages/customers/HeroSection/HeroSection';
import FeatureSection from '../../pages/customers/FeatureSection/FeatureSection';
import ProductSection1 from './ProductsSection/ProductsSection1';
import BannerSection from './BannerSection/BannerSection';
import BannerSection2 from './BannerSection/BannerSection2';
import ProductSection2 from './ProductsSection/ProductsSection2';
import NewLetterSection from '../../pages/customers/NewLetterSection/NewLetterSection';
import Footer from '../../components/footerCustomer/FooterCustomer';
import SearchBar from './SearchBar';

const HomeCustomer = () => {
  return (
    <>
      <Header />
      <SearchBar />
      <HeroSection />
      <FeatureSection />

      <ProductSection1 />

      <BannerSection2 />
            
      

      <ProductSection2 />

      <BannerSection />

      <NewLetterSection />

      
      <Footer />
      
    </>
  );
};

export default HomeCustomer;