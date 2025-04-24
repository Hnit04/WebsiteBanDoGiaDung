import React from "react";
import "./AboutContent.css";
import imgSrc from "../../../assets/img/about/slogan.png";
import videoSrc from "../../../assets/img/about/1.mp4";
const AboutContent = () => {
  return (
    <>
      <section id="about-content" className="section-p1">
        <div className="img-container">
          <img src={imgSrc} alt="About Us" className="img" />
        </div>
        <div className="content-container">
          <div className="text">
            <h2>Who We Are?</h2>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quasi sint
              quibusdam iure pariatur dicta obcaecati cumque commodi fuga
              aspernatur ex eligendi, maiores, odit et omnis quaerat in atque
              recusandae animi!
            </p>
            <p>
              Create stunning images with as much or as little control as you like
              thanks to a choice of Basic and Create modes
            </p>
          </div>
        </div>
      </section>

      <section id="about-app">
        <div className="video">
        <h2>Download Our <a href="#" onClick={(e) => {
            e.preventDefault();
        }}>App</a></h2>
          <video controls autoPlay>
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>
    </>
  );
};

export default AboutContent;
