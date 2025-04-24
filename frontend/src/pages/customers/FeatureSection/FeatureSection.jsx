import React from "react";
import "./FeatureSection.css";
import freeShip from "../../../assets/img/features/f1.png";
import onlineOrder from "../../../assets/img/features/f2.png";
import saveMoney from "../../../assets/img/features/f3.png";
import promotions from "../../../assets/img/features/f4.png";
import happySell from "../../../assets/img/features/f5.png";
import support from "../../../assets/img/features/f6.png";


const FeatureSection = () => {
  return (
    <>
      <section id="feature" className="section-p1">
        <div className="fe-box">
          <img src={freeShip} alt="img" />
          <h6>Free Shipping</h6>
        </div>
        <div className="fe-box">
          <img src={onlineOrder} alt="img" />
          <h6>Online Order</h6>
        </div>
        <div className="fe-box">
          <img src={saveMoney} alt="img" />
          <h6>Save Money</h6>
        </div>
        <div className="fe-box">
          <img src={promotions} alt="img" />
          <h6>Promotions</h6>
        </div>
        <div className="fe-box">
          <img src={happySell} alt="img" />
          <h6>Happy Sell</h6>
        </div>
        <div className="fe-box">
          <img src={support} alt="img" />
          <h6>F24/7 Support</h6>
        </div>
      </section>
    </>
  );
};

export default FeatureSection;
