import React from 'react';
import { CarouselProvider, Slider, Slide, DotGroup } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import './ImageCarousel.css';

import image1 from "../Assets/bannerHome1.png";
import image2 from "../Assets/bannerHome2.png";

const images = [image1, image2];
const ImageCarousel = () => {
  return (
    <div className="modern-carousel-wrapper">
      <CarouselProvider
        naturalSlideWidth={450}
        naturalSlideHeight={125}
        totalSlides={images.length}
        isPlaying={true}        
        interval={6000}         
        lockOnWindowScroll={true}
        dragEnabled={true}
        touchEnabled={true}
      >
        <Slider>
          {images.map((image, index) => (
            <Slide index={index} key={index}>
              <div className="slide-container">
                <img 
                  src={image} 
                  alt={`Featured Collection ${index + 1}`} 
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>
            </Slide>
          ))}
        </Slider>
        <DotGroup />
      </CarouselProvider>
    </div>
  );
};

export default ImageCarousel;
