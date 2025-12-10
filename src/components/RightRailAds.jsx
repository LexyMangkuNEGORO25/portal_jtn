// src/components/RightRailAds.jsx
import React from "react";
import { Link } from "react-router-dom";

// Komponen sidebar kanan berisi berita populer dan iklan
export default function RightRailAds({ trending = [] }) {
  const imgOf = (n) =>
    n.news_image_new || n.news_image || "/no-image.png";

  return (
    <aside className="k-sidebar">
      <div className="sidebar-sticky">
        {/* Bagian berita terpopuler */}
        <div className="trending-section">
          <h5>Terpopuler</h5>

          {trending && trending.length > 0 ? (
            trending.slice(0, 6).map((n) => {
              const id = n.news_id || n.id || n.slug;
              return (
                <Link key={id} to={`/detail/${id}`} className="trending-item">
                  <img
                    src={imgOf(n)}
                    alt={n.news_title}
                    loading="lazy"
                    onError={(e) => (e.currentTarget.src = "/no-image.png")}
                  />
                  <div>
                    <div className="tr-title">{n.news_title}</div>
                    <small>{n.news_datepub?.slice(0, 10) || ""}</small>
                  </div>
                </Link>
              );
            })
          ) : (
            <p className="text-muted small">Belum ada berita populer.</p>
          )}
        </div>

        {/* Iklan vertikal */}
        <div className="rail-right-ad mt-3">
          <img
            src="/ads/iklanvertikal.jpg"
            alt="Iklan Vertikal"
            loading="lazy"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              borderRadius: 12,
              marginBottom: "1rem",
            }}
            onError={(e) => {
              e.currentTarget.src = "/ads/banneriklan.jpg";
              e.currentTarget.style.objectFit = "contain";
              e.currentTarget.style.background = "#f4f6f8";
            }}
          />
        </div>

        {/* Dua iklan persegi */}
        <div className="mt-3">
          <img
            src="/ads/iklansl.jpg"
            alt="Iklan Persegi 1"
            loading="lazy"
            className="square-ad"
            onError={(e) => {
              e.currentTarget.src = "/ads/banneriklan.jpg";
              e.currentTarget.style.objectFit = "contain";
              e.currentTarget.style.background = "#f4f6f8";
            }}
          />
          <img
            src="/ads/iklangrafik.jpg"
            alt="Iklan Persegi 2"
            loading="lazy"
            className="square-ad"
            onError={(e) => {
              e.currentTarget.src = "/ads/banneriklan.jpg";
              e.currentTarget.style.objectFit = "contain";
              e.currentTarget.style.background = "#f4f6f8";
            }}
          />
        </div>
      </div>
    </aside>
  );
}
