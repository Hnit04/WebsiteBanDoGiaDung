import React from "react";
import "./NewLetterSection.css";
const NewLetterSection = () => {
  return (
    <>
      <section id="newsletter" class="section-p1 section-m1">
        <div class="newstext">
          <h4>Sign up For Newsletters</h4>
          <p>
            Get E-mail updates about our latest shop and{" "}
            <span>special offers.</span>
          </p>
        </div>
        <div class="form">
          <input type="email" placeholder="Enter your email address" />
          <button class="normal">Sign up</button>
        </div>
      </section>
    </>
  );
};

export default NewLetterSection;
