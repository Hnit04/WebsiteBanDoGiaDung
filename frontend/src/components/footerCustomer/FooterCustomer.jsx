import React from "react";
import "./FooterCustomer.css";
import logo from "../../assets/LogoWeb.jpg";
import appStore from "../../assets/img/pay/app.jpg";
import playStore from "../../assets/img/pay/play.jpg";
import pay from "../../assets/img/pay/pay.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faPinterest,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
const FooterCustomer = () => {
  return (
    <footer className="section-p1">
      <div className="col">
        <img className="logo" src={logo} alt="img"/>
        <h4>Contact</h4>
        <p>Address: 562 Wellington Road, Street 32, San Francisco</p>
        <p>
          <strong>Phone:</strong> +01 2222 365 /(+91) 01 2345 6789
        </p>
        <p>
          <strong>Hours:</strong> 10:00 - 18:00, Mon - Sat
        </p>
        <div className="follow">
          <h4>Follow us</h4>
          <div className="iconF">
            <FontAwesomeIcon icon={faFacebookF} className="fab fa-facebook-f" />
            <FontAwesomeIcon icon={faTwitter} className="fab fa-twitter" />
            <FontAwesomeIcon icon={faInstagram} className="fab fa-instagram" />
            <FontAwesomeIcon icon={faPinterest} className="fab fa-pinterest-p" />          
            <FontAwesomeIcon icon={faYoutube} className="fab fa-youtube" />
          </div>
        </div>
      </div>
      <div className="col">
        <h4>About</h4>
        <a href="#">About Us</a>
        <a href="#">Delivery Information</a>
        <a href="#">Privacy Policy</a>
        <a href="#">Terms & Conditions</a>
        <a href="#">Contact Us</a>
      </div>
      <div className="col">
        <h4>Account</h4>
        <a href="#">Sign In</a>
        <a href="#">View Cart</a>
        <a href="#">My Wishlist</a>
        <a href="#">Track My Order</a>
        <a href="#">Help</a>
      </div>
      <div className="col install">
        <h4>Install App</h4>
        <p>From App Store or Google Play</p>
        <div className="row">
          <img src={appStore} alt="img" />
          <img src={playStore} alt="img" />
        </div>
        <p>Secured Payment Gateways</p>
        <img src={pay} alt="img" />
      </div>
    </footer>
  );
};

export default FooterCustomer;
