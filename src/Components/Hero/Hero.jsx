import React from "react";
import { Link } from "react-router-dom";
import "./Hero.css";
import image from "../Assets/hero_1.png";
import hand_icon from "../Assets/hand_icon.png";
import arrow_icon from "../Assets/arrow.png";

const Hero = () => {
  return (
    <div className="hero">
      <div className="hero-left">
        <h2>All for Men and Women</h2>
        <div>
          <div className="hero-hand-icon">
            <p>new</p>
            <img src={hand_icon} alt="" />
          </div>
          <p>collections</p>
          <p>for everyone</p>
        </div>
        <div className="hero-latest-btn">
          <Link to="/men" className="shopping-link">
            <span>Go Shopping</span>
          </Link>
        </div>
      </div>
      <div className="hero-right">
        <img src={image} alt="imagem-man" className="hero-image" />
      </div>
    </div>
  );
};

export default Hero;
