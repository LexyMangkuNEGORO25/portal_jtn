import React from "react";

export default function SideRailAd({
  src = "/ads/iklanvertikal.jpg",   // default: gambar vertikal kamu
  href = "#",
  alt = "Iklan",
  side = "right",
}) {
  return (
    <aside className={`side-ad ${side === "left" ? "left-ad" : "right-ad"}`}>
      <a href={href} target="_blank" rel="noopener noreferrer">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = "/ads/banneriklan.jpg";
            e.currentTarget.style.objectFit = "contain";
          }}
        />
      </a>
    </aside>
  );
}
