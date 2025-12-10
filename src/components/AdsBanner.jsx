// src/components/AdsBanner.jsx
import React from "react";

export default function AdsBanner({ src, alt = "Iklan", height = 90, className = "" }) {
  return (
    <div className={`ad-slot text-center my-3 ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        style={{
          width: "100%",
          height: height,
          objectFit: "cover",
          borderRadius: "8px",
          maxWidth: "970px",
        }}
        onError={(e) => {
          e.currentTarget.src = "/ads/default-banner.jpg";
          e.currentTarget.onerror = null;
        }}
      />
      <div className="ad-badge">Iklan</div>
    </div>
  );
}
