import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMap, faEnvelope, faPhone, faClock } from '@fortawesome/free-solid-svg-icons';
import './ContactContent.css';
import p1 from '../../../assets/img/people/1.png';
import p2 from '../../../assets/img/people/2.png';
import p3 from '../../../assets/img/people/3.png';

const ContactContent = () => {
  return (
    <>
      <section id="contact-details" className="section-p1">
        <div className="details">
          <span className="section-title">GET IN TOUCH</span>
          <h2>Visit one of our agency locations or contact us today</h2>
          <h3>Head Office</h3>
          <ul className="contact-info">
            <li>
              <FontAwesomeIcon icon={faMap} className="contact-icon" />
              <p>56 Glassford Street Glasgow G1 1UL New York</p>
            </li>
            <li>
              <FontAwesomeIcon icon={faEnvelope} className="contact-icon" />
              <p>contact@example.com</p>
            </li>
            <li>
              <FontAwesomeIcon icon={faPhone} className="contact-icon" />
              <p>+1 234 567 8900</p>
            </li>
            <li>
              <FontAwesomeIcon icon={faClock} className="contact-icon" />
              <p>Monday to Saturday: 9:00 AM to 4:00 PM</p>
            </li>
          </ul>
        </div>

        <div className="map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.02390067087!2d106.69976390000001!3d10.732639899999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528b2747a81a3%3A0x33c1813055acb613!2sTon%20Duc%20Thang%20University!5e0!3m2!1sen!2s!4v1714319694011!5m2!1sen!2s"
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="location map"
          />
        </div>
      </section>

      <section id="form-details" className="section-p1">
        <form onSubmit={(e) => e.preventDefault()}>
          <span className="section-title">LEAVE A MESSAGE</span>
          <h2>We love to hear from you</h2>
          <div className="form-group">
            <input 
              type="text" 
              placeholder="Your Name"
              required 
            />
            <input 
              type="email" 
              placeholder="Email"
              required 
            />
            <input 
              type="text" 
              placeholder="Subject"
              required 
            />
            <textarea 
              placeholder="Your Message"
              rows="10"
              required
            />
            <button type="submit" className="normal">Submit</button>
          </div>
        </form>

        <div className="people">
          <div className="person">
            <img src={p1} alt="John Doe" />
            <div className="person-details">
              <span className="name">John Doe</span>
              <p>Senior Marketing Manager</p>
              <p>Phone: + 00 123 000 77 88</p>
              <p>Email: contact@gmail.com</p>
            </div>
          </div>

          <div className="person">
            <img src={p2} alt="William Smith" />
            <div className="person-details">
              <span className="name">William Smith</span>
              <p>Senior Marketing Manager</p>
              <p>Phone: + 00 123 000 77 88</p>
              <p>Email: contact@gmail.com</p>
            </div>
          </div>

          <div className="person">
            <img src={p3} alt="Emma Stone" />
            <div className="person-details">
              <span className="name">Emma Stone</span>
              <p>Senior Marketing Manager</p>
              <p>Phone: + 00 123 000 77 88</p>
              <p>Email: contact@gmail.com</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactContent;