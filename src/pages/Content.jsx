import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import HeroMagazine from "../components/HeroMagazine";
import { API_BASE, IMAGE_BASE } from "../config/api";

const KATEGORI = [
  "ekonomi",
  "kuliner",
  "politik",
  "ruang mahasiswa",
  "olahraga",
  "selebriti",
  "kesehatan",
  "agama",
  "pendidikan",
  "peristiwa",
  "wisata",
  "transportasi",
];

const imgOf = (n) => {
  const possible =
    n?.news_image_new || n?.news_image || n?.thumbnail || n?.image || n?.photo || "";
  if (!possible || possible === "null" || possible.trim() === "") {
    return "https://risetcdn.jatimtimes.com/images/logo.png";
  }
  const clean = possible.trim().replace(/^\/+/, "");
  if (!/^https?:\/\//i.test(clean)) {
    return `${IMAGE_BASE}/${clean}`;
  }
  return clean;
};

const parseDate = (n) => Date.parse(n?.news_datepub || n?.date || 0) || 0;

function getKategori(n) {
  return (
    n?.category?.name ||
    n?.category_name ||
    n?.news_category ||
    n?.news_category_name ||
    n?.rubric ||
    n?.rubric_name ||
    "Umum"
  );
}

function formatWaktu(n) {
  const ts = parseDate(n);
  if (!ts) return "";
  const dt = new Date(ts);
  const tgl = dt.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const jam = dt.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${tgl} pukul ${jam}`;
}

export default function Content() {
  const [allNews, setAllNews] = useState([]);
  const [byCategory, setByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [heroHeight, setHeroHeight] = useState(0);
  const heroRef = useRef(null);

  useLayoutEffect(() => {
    if (heroRef.current) {
      setHeroHeight(heroRef.current.offsetHeight);
    }
  });

  useEffect(() => {
    async function fetchAll() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API_BASE}/news`);
        if (!res.ok) throw new Error(`Gagal mengambil data (${res.status})`);

        const data = await res.json();
        const newsArray = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
          ? data.data
          : [];

        if (newsArray.length === 0) {
          setError("Tidak ada berita yang ditemukan dari server.");
        }

        const sorted = [...newsArray].sort((a, b) => parseDate(b) - parseDate(a));
        setAllNews(sorted);

        const results = await Promise.all(
          KATEGORI.map(async (cat) => {
            try {
              const resCat = await fetch(
                `${API_BASE}/news/category/${encodeURIComponent(cat)}`
              );
              const json = await resCat.json();
              const arr = Array.isArray(json)
                ? json
                : Array.isArray(json.data)
                ? json.data
                : [];
              return [cat, arr.slice(0, 6)];
            } catch {
              return [cat, []];
            }
          })
        );

        setByCategory(Object.fromEntries(results));
      } catch (e) {
        console.error(" Error ambil berita:", e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, []);

  if (loading)
    return <div className="container mt-5 text-center">Memuat berita…</div>;

  if (error)
    return (
      <div className="container mt-5 text-center text-danger">
         {error}
      </div>
    );

  const heroItems = allNews.slice(0, 4);

  return (
    <div className="container-fluid mt-2 py-3 home">
      <div className="container d-flex justify-content-between align-items-start gap-4">
        <div ref={heroRef} style={{ flex: "2" }}>
          <HeroMagazine items={heroItems} />
        </div>

        <div
          style={{
            flex: "1",
            borderRadius: "12px",
            overflow: "hidden",
            backgroundColor: "#0f141d",
            height: heroHeight ? `${heroHeight}px` : "auto",
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          }}
        >
          <img
            src="/ads/iklanforex.jpg"
            alt="Iklan Forex"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      </div>

      <div className="container my-5 text-center youtube-wrapper">
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16 / 9",
            borderRadius: "12px",
            overflow: "hidden",
            background: "#000",
          }}
        >
          <iframe
            src="https://www.youtube.com/embed/itrHEWYls2k?rel=0&modestbranding=1&showinfo=0&controls=1"
            title="Jatim Times YouTube"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              border: "none",
            }}
          ></iframe>
        </div>

        <p className="mt-3">
          <a
            href="https://youtu.be/itrHEWYls2k?si=Cr8RlHUqsUXxhr5Q"
            target="_blank"
            rel="noopener noreferrer"
            className="youtube-btn"
          >
            Tonton di YouTube
          </a>
        </p>
      </div>

      <div className="container kategori-wrapper">
        {Object.entries(byCategory).map(([kategori, items]) => (
          <div key={kategori} className="mb-5">
            <h4 className="section-title">{kategori}</h4>

            <section className="news-grid cards">
              {items.length ? (
                items.map((n, idx) => {
                  const id = n.news_id || n.id || idx;
                  return (
                    <Link
                      key={id}
                      to={`/detail/${id}`}
                      className="card-news text-reset link-news"
                    >
                      <div className="ratio-thumb" style={{ aspectRatio: "16/9" }}>
                        <img
                          src={imgOf(n)}
                          alt={n.news_title}
                          loading="lazy"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div className="p-3">
                        <div className="news-title fw-bold line-2">
                          {n.news_title}
                        </div>
                        <div className="d-inline-flex align-items-center mt-2 px-3 py-1">
                          <strong style={{ marginRight: "6px" }}>
                            {getKategori(n)}
                          </strong>
                          <span>• {formatWaktu(n)}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <p className="text-muted">Belum ada berita kategori ini.</p>
              )}
            </section>
          </div>
        ))}
      </div>
    </div>
  );
}
