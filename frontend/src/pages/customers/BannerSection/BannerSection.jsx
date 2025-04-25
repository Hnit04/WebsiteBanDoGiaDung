import React from "react";
import "./BannerSection.css";
const BannerSection = () => {
  return (
    <>
      <section id="sm-banner" class="section-p1">
        <div className="banner-box">
          <h4>Crazy deals</h4>
          <h2>Buy 1 get 1 free</h2>
          <span>The best classic dress is on sale at cara</span>
          <button class="white">Learn More</button>
        </div>
        <div className="banner-box banner-box2">
          <h4>Spring/Summer</h4>
          <h2>Upcomming Season</h2>
          <span>The best classic dress is on sale at cara</span>
          <button class="white">Collection</button>
        </div>
      </section>

      <section id="banner3">
        <div className="banner-box">
          <h2>SEASON SALE</h2>
          <h3>Winter Collection -50% OFF</h3>
        </div>
        <div className="banner-box banner-box2">
          <h2>NEW FOOTWEAR COLLECTION</h2>
          <h3>WSpring / Summer 2022</h3>
        </div>
        <div class="banner-box banner-box3">
          <h2>T-SHIRTS</h2>
          <h3>New Trendy Prints</h3>
        </div>
      </section>
    </>
  );
};

export default BannerSection;
