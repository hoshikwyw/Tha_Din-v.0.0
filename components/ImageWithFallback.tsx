"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

const FALLBACK =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 500'%3E%3Crect width='500' height='500' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='28' fill='%239ca3af'%3EImage unavailable%3C/text%3E%3C/svg%3E";

type Props = Omit<ImageProps, "src" | "alt"> & {
  src?: string | null;
  alt?: string;
  fallback?: string;
};

const ImageWithFallback = ({ src, alt, fallback = FALLBACK, ...rest }: Props) => {
  const [errored, setErrored] = useState(false);
  const resolvedSrc = !src || errored ? fallback : src;

  return (
    <Image
      {...rest}
      src={resolvedSrc}
      alt={alt ?? ""}
      onError={() => setErrored(true)}
      unoptimized={resolvedSrc === fallback}
    />
  );
};

export default ImageWithFallback;
