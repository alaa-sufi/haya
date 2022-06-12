import React, { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Keyboard, Navigation, Zoom } from "swiper";
export default function ZoomImages(props) {
  return (
    <div className="h-three-images">
      <div className="">
        <Swiper
          dir="rtl"
          zoom={true}
          navigation={true}
          grabCursor={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          keyboard={{
            enabled: true,
          }}
          slidesPerView={3}
          spaceBetween={0}
          modules={[Autoplay, Keyboard, Navigation, Zoom]}
        >
          {props.images &&
            props.images.map((image, index) => (
              <SwiperSlide key={index} className="h-slide-item">
                  <Image
                    src={image}
                    layout="responsive"
                    width={300}
                    height={200}
                    alt="zoom image"
                  />
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
}
