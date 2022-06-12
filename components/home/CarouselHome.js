import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import useWindowSize from "hooks/use-window"
import {
  Autoplay,
  Keyboard,
  Navigation,
  Pagination,
  EffectCreative,
  Thumbs
} from "swiper";
import Image from "next/image";
import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'

export default function CarouselHome({ data }) {
  const { t, lang } = useTranslation("all")

  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const size = useWindowSize();

  return (
    <div className="h-home-slider">
      <Swiper
        style={{
          "--swiper-navigation-color": "#fff",
          "--swiper-pagination-color": "#fff",
        }}
        loop={true}
        dir={lang === "ar"? "rtl" :"ltr"}
        onSwiper={setThumbsSwiper}
        className="mySwiper carousel-1"
      >
        {data &&
          data.map((category, index) => (
            <SwiperSlide key={index}>
              <Image
                src={category.image}
                className=" d-block w-100"
                alt={category.name}
                layout="responsive"
                width={700}
                height={size.width < 576 ? 450 : 320}
                
              />
            </SwiperSlide>
          ))}
      </Swiper>
      <div className="container">
        <Swiper
          style={{
            "--swiper-navigation-color": "#fff",
            "--swiper-pagination-color": "#fff",
          }}
          dir={lang === "ar"? "rtl" :"ltr"}
        loop={true}

          pagination={{
            clickable: true,
          }}
          navigation={true}
          grabCursor={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,

          }}
          keyboard={{
            enabled: true,
          }}
          thumbs={{ swiper: thumbsSwiper }}
          modules={[
            Autoplay,
            Keyboard,
            Navigation,
            Pagination,
            EffectCreative,
            Thumbs
          ]}
        
          className="mySwiper carousel-2"
        >
          {data &&
            data.map((category, index) => (
              <SwiperSlide key={index}>
                <Image
                  src={category.image}
                  className=" radius-2 h-home-slider-img"
                  alt={category.name}
                  layout="responsive"
                  width={700}
                  height={size.width < 576 ? 350 : 250}
                />
                <div className="h-home-slider-head">
                  <h2>{category.name}</h2>
                  <Link href={`/user/categories/${category.id}`}>
                    <a className="h-button">{t("go_to_the_category")}</a>
                  </Link>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
}
