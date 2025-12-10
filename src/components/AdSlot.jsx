import React from "react";

export default function AdSlot({
  type = "leaderboard",
  src,                  // bisa berbeda tiap halaman
  alt = "Iklan"
}) {
  if (!src) return null; // jika belum diisi, tidak render apa-apa

  const cls =
    type === "mrec" ? "ad-slot ad-mrec" :
    type === "mrecSmall" ? "ad-slot ad-mrec-small" :
    type === "skyscraper" ? "ad-slot ad-skyscraper" :
    "ad-slot ad-leaderboard";

  return (
    <div className={cls}>
      <img src={src} alt={alt} loading="lazy" />
      <span className="ad-badge">Iklan</span>
    </div>
  );
}
