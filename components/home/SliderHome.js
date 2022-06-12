import React from 'react'
import Link from 'next/link'
import Slider from "react-slick";
import Image from 'next/image';
// import car from 'public/temp/bus1.jpg';

export default function SliderHome({ head, linkViewMore, count, centerMode, aspectRatio, dataPage }) {
  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    slidesToShow: count,
    centerMode: centerMode,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: count,

        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: Number.parseInt(count / 2),

        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: Number.parseInt(count / 2),
        }
      }
    ]

  };
  return (
    <div className="h-home-types text-center">
      <div className="container">
        <h2 className="h-big"> {head} <small>
          <Link href={linkViewMore} >
            <a className="c-blue">رؤية المزيد</a>
          </Link>
        </small></h2>
        <Slider {...settings}>
          {dataPage && dataPage.map((d, i) => (
            <div className="h-slide-item" key={i}>
              <div className="position-relative">
                <Link href={`${linkViewMore}/${d.id}`} >
                  <a className="h-global-a" ></a>
                </Link>
                <div style={{ aspectRatio: aspectRatio }} className="w-100">
                  <Image src={d.image} alt="type" layout="fill" />
                </div>
              </div>
              <h2 className="fw-bold">{d.name}</h2>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  )
}

