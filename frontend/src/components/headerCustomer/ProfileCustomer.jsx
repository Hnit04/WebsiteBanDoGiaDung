import React, { useState } from "react";
import avatarC from "../../assets/img/about/avatar.jpg";
import "./ProfileCustomer.css";
import HeaderCustomer from "./HeaderCustomer";
import FooterCustomer from "../footerCustomer/FooterCustomer";
const ProfileCustomer = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    tel: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data:", formData);
    // Handle form submission
  };

  return (
    <div>
      <HeaderCustomer />
      <div className="container">
        <div className="left-content avatarC">
          <h4>Thông tin cá nhân</h4>
          <img src={avatarC} alt="Profile avatar" />
          <button className="normal">Chọn ảnh</button>
        </div>
        <div className="right-content form">
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />

            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label htmlFor="tel">Số điện thoại</label>
            <input
              type="tel"
              id="tel"
              name="tel"
              value={formData.tel}
              onChange={handleChange}
              required
            />

            <label htmlFor="address">Địa chỉ</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Nhập địa chỉ đầy đủ"
            />

            <button type="submit" className="normal save">
              Lưu thay đổi
            </button>
          </form>
        </div>
      </div>
      <FooterCustomer />
    </div>
  );
};

export default ProfileCustomer;
