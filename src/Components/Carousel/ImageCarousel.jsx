import React from 'react';
import { CarouselProvider, Slider, Slide, DotGroup } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css'; 

import image1 from "../Assets/bannerHome1.png";
import image2 from "../Assets/bannerHome2.png";

const images = [image1, image2];
const ImageCarousel = () => {
  return (
    <CarouselProvider
      naturalSlideWidth={450}
      naturalSlideHeight={125}
      totalSlides={images.length}
      isPlaying={true}        
      interval={5000}         
      lockOnWindowScroll={true}
    >
       <Slider>
          {images.map((image, index) => (
            <Slide index={index} key={index}>
              <img src={image} alt={`Slide ${index}`} style={{ width: '100%', maxHeight: '100vh', objectFit: 'cover' }} />
            </Slide>
          ))}
        </Slider>
        <DotGroup />
    </CarouselProvider>
  );
};

export default ImageCarousel;
