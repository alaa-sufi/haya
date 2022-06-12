import React, { useState } from "react";
import Image from "next/image";
export default function ThreeImgs({ image1, image2, image3 }) {
  return (
    <div className="h-three-images">
      <div className="row mb-3">
        <div className="col-md-3 col-6">
          <Image
            src={image1}
            layout="responsive"
            width={100}
            height={100}
            alt="zoom image"
            className="rounded-3 object-cover "
          />
        </div>
        <div className="col-md-3 col-6">
          <Image
            src={image2}
            layout="responsive"
            width={100}
            height={100}
            alt="zoom image"
            className="rounded-3 object-cover "
          />
        </div>
        <div className="col-md-6 col-12 mt-md-0 mt-3">
          <Image
            src={image3}
            layout="responsive"
            width={170}
            height={80}
            alt="zoom image"
            className="rounded-3 object-cover "
          />
        </div>
      </div>
    </div>
  );
}
