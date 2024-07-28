import React from "react";
import "./DescriptionBox.css";

const DescriptionBox = () => {
  return (
    <div className="descriptionbox">
      <div className="descriptionbox-navigator">
        <div className="descriptionbox-nav-box">Description</div>
        <div className="descriptionbox-nav-box fade">Reviews (77)</div>
      </div>
      <div className="descriptionbox-description">
        <p>
        Introducing our latest innovation in home fitness: 
        the Apex Pro Series Treadmill. Designed for enthusiasts and beginners alike, 
        this state-of-the-art treadmill offers unparalleled performance and 
        versatility. Featuring a powerful yet whisper-quiet motor, 
        the Apex Pro Series ensures smooth and efficient workouts,
        whether you're sprinting or walking. Its sleek, ergonomic design includes 
        an interactive LCD display that tracks your speed, distance, calories burned,
         and heart rate in real-time, keeping you motivated throughout your fitness 
         journey. 
        </p>
        <p>
        Built-in programmable workouts cater to every fitness level, while 
         integrated speakers let you enjoy your favorite music or podcasts seamlessly. 
         Experience the future of home fitness with the Apex Pro Series 
         Treadmill - where innovation meets endurance.
        </p>
      </div>
    </div>
  );
};

export default DescriptionBox;
