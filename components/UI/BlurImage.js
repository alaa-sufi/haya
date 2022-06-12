import React, { useState, useCallback } from "react";
import { useBlurhash } from "../../hooks/useHash";
import { useInView } from "react-intersection-observer";
import Image from "next/image";

// Uses browser-native `loading="lazy"` to lazy load images
// Renders a blurhash value to a blob when it about to appear on screen.
// Only renders the blurhash when the image hasn't loaded yet.
// Removes the blob once the image has finished loading.
export function BlurImg(allProps) {
  const { loading = "lazy", blurhash, style, ...props } = allProps;

  const [imgLoaded, setImgLoaded] = useState(false);
  const [ref, inView] = useInView({ rootMargin: "110%" });
  const blurUrl = useBlurhash(!imgLoaded && inView ? blurhash : null);

  const handleOnLoad = useCallback(() => {
    setImgLoaded(true);
  }, []);

  const newStyle = blurUrl
    ? {
        ...style,
        backgroundImage: `url("${blurUrl}")`,
        backgroundSize:
          props.width && props.height
            ? `${props.width}px ${props.height}px`
            : "100% 100%"
      }
    : style;

  return (
    <Image
      alt="Blur hash"
      ref={ref}
      {...props}
      loading={loading}
      onLoad={handleOnLoad}
      style={newStyle}
    />
  );
}
