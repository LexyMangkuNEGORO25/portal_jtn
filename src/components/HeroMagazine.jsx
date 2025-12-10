import React from "react";
import { Link } from "react-router-dom";

export default function HeroMagazine({ items = [] }) {
  if (!items || items.length === 0) return null;

  const main = items[0];
  const others = items.slice(1, 4);

  const imgOf = (n) =>
    n?.news_image_new || n?.news_image || "/no-image.png";

  return (
    <div className="hero-magazine">
      {/* ==== Hero Utama (Kiri) ==== */}
      <div className="main-hero">
        <Link
          to={`/detail/${main.news_id || main.id}`}
          className="text-reset link-news"
          style={{ textDecoration: "none" }}
        >
          <img
            src={imgOf(main)}
            alt={main.news_title}
            loading="lazy"
            onError={(e) => (e.currentTarget.src = "/no-image.png")}
          />
          <div className="title">{main.news_title}</div>
        </Link>
      </div>

      {/* ==== 3 Hero Kecil di Kanan ==== */}
      <div className="side-hero">
        {others.map((n, idx) => (
          <Link
            key={idx}
            to={`/detail/${n.news_id || n.id}`}
            className="item text-reset link-news"
            style={{ textDecoration: "none" }}
          >
            <img
              src={imgOf(n)}
              alt={n.news_title}
              loading="lazy"
              onError={(e) => (e.currentTarget.src = "/no-image.png")}
            />
            <div className="title">{n.news_title}</div>
          </Link>
        ))}
      </div>

      {/* ==== STYLE ==== */}
      <style>
        {`
          .link-news,
          .link-news:hover,
          .main-hero .title,
          .side-hero .title {
            text-decoration: none !important;
          }

          /* Hover biru */
          .main-hero:hover .title,
          .side-hero .item:hover .title {
            color: #3b82f6 !important;
            transition: color 0.3s ease;
          }

          /* Hero kiri (utama) */
          .main-hero {
            position: relative;
            overflow: hidden;
            border-radius: 12px;
            background: #121621;
            flex: 2;
          }

          .main-hero img {
            width: 100%;
            height: 480px !important;
            object-fit: cover;
            display: block;
            filter: brightness(0.9);
            transition: transform 0.3s ease;
          }

          .main-hero:hover img {
            transform: scale(1.04);
          }

          .main-hero .title {
            position: absolute;
            bottom: 20px;
            left: 20px;
            right: 20px;
            color: #fff;
            font-weight: 700;
            font-size: 1.6rem;
            line-height: 1.4;
            z-index: 2;
          }

          /* Hero kanan (3 berita kecil) */
          .side-hero {
            display: flex;
            flex-direction: column;
            gap: 1.3rem;
            flex: 1;
          }

          .side-hero .item {
            position: relative;
            overflow: hidden;
            border-radius: 12px;
            background: #121621;
            box-shadow: 0 4px 16px rgba(0,0,0,0.5);
            transition: transform 0.25s ease;
          }

          .side-hero .item:hover {
            transform: translateY(-3px);
          }

          .side-hero .item img {
            width: 100%;
            height: 180px !important; /* 🔥 dipaksa tinggi baru */
            object-fit: cover;
            filter: brightness(0.88);
          }

          .side-hero .title {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 14px 16px;
            background: linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.25));
            color: #fff;
            font-weight: 600;
            font-size: 1.05rem;
            line-height: 1.45;
          }

          /* Grid container */
          .hero-magazine {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 1.5rem;
            align-items: stretch;
          }

          /* Responsif */
          @media (max-width: 992px) {
            .hero-magazine {
              grid-template-columns: 1fr;
            }
            .main-hero img {
              height: 320px !important;
            }
            .side-hero .item img {
              height: 160px !important;
            }
          }
        `}
      </style>
    </div>
  );
}
