import React from "react";
import "./BlogContent.css";
import b1 from "../../../assets/img/blog/b1.jpg";
import b2 from "../../../assets/img/blog/b2.jpg";
import b3 from "../../../assets/img/blog/b3.jpg";
import b4 from "../../../assets/img/blog/b4.jpg";
import b6 from "../../../assets/img/blog/b6.jpg";
const BlogContent = () => {
  return (
    <>
      <section id="blog">
        <div className="blog-box">
          <div className="blog-img">
            <img src={b1} alt="" />
          </div>
          <div className="blog-details">
            <h4>The Cotton-Jersay Zip-Up Hoodie</h4>
            <p>
              Kickstarer man braid godard coloring book. Raclette waistcoat
              selfies yr wolf chartreuse hexagon irony, godard..
            </p>
          </div>
          <h1>13/05</h1>
        </div>
        <div className="blog-box">
          <div className="blog-img">
            <img src={b2} alt="" />
          </div>
          <div className="blog-details">
            <h4>How to Style a Quiff</h4>
            <p>
              Kickstarer man braid godard coloring book. Raclette waistcoat
              selfies yr wolf chartreuse hexagon irony, godard..
            </p>
          </div>
          <h1>01/05</h1>
        </div>
        <div className="blog-box">
          <div className="blog-img">
            <img src={b3} alt="" />
          </div>
          <div className="blog-details">
            <h4>Must-Have Skater Girl Items </h4>
            <p>
              Kickstarer man braid godard coloring book. Raclette waistcoat
              selfies yr wolf chartreuse hexagon irony, godard..
            </p>
          </div>
          <h1>14/04</h1>
        </div>
        <div className="blog-box">
          <div class="blog-img">
            <img src={b4} alt="" />
          </div>
          <div className="blog-details">
            <h4>Runway-Inspired Trends</h4>
            <p>
              Kickstarer man braid godard coloring book. Raclette waistcoat
              selfies yr wolf chartreuse hexagon irony, godard..
            </p>
          </div>
          <h1>14/04</h1>
        </div>
        <div className="blog-box">
          <div class="blog-img">
            <img src={b6} alt="" />
          </div>
          <div className="blog-details">
            <h4>AW20 Menswear Trends</h4>
            <p>
              Kickstarer man braid godard coloring book. Raclette waistcoat
              selfies yr wolf chartreuse hexagon irony, godard..
            </p>
          </div>
          <h1>31/03</h1>
        </div>
      </section>
    </>
  );
};


export default BlogContent;
