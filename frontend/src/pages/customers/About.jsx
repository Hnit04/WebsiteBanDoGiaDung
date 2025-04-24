import React from "react";
import HeaderCustomer from "../../components/headerCustomer/HeaderCustomer";
import FooterCustomer from "../../components/footerCustomer/FooterCustomer";
import FeatureSection from "./FeatureSection/FeatureSection";
import NewLetterSection from "./NewLetterSection/NewLetterSection";
import AboutBanner from "./AboutBanner/AboutBanner";
import AboutContent from "./AboutContent/AboutContent";
import SearchBar from "./SearchBar";
const About = () => {
  return (
    <>
      <HeaderCustomer />
      <SearchBar />
      <AboutBanner />
      <AboutContent />
      <FeatureSection />
      <NewLetterSection />
      <FooterCustomer />
    </>
  );
};

export default About;
