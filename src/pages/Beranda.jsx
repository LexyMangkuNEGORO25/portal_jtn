import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HeroMagazine from "../components/HeroMagazine";

const API_BASE = `http://${window.location.hostname}:5000`;

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

const imgOf = (n) => n?.news_image_new || n?.news_image || "/no-image.png";
const parseDate = (n) => Date.parse(n?.news_datepub || n?.date || 0) || 0;

function formatWaktu(n) {
  const ts = parseDate(n);
  if (!ts) return "";
  const dt = new Date(ts);
  return dt.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Beranda() {
  const [allNews, setAllNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllData() {
      try {
        const res = await fetch(`${API_BASE}/api/news`);
        if (!res.ok) throw new Error("Gagal ambil data berita");

        const data = await res.json();
        const newsArray = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
          ? data.data
          : [];

        const sorted = [...newsArray].sort(
          (a, b) => parseDate(b) - parseDate(a)
        );

        console.log("Total berita:", sorted.length);
        setAllNews(sorted);
      } catch (e) {
        console.error(" Error ambil berita:", e);
        setAllNews([]);
      } finally {
        setLoading(false);
      }
    }

    fetchAllData();
  }, []);

  if (loading)
    return <div className="container mt-5">Memuat berita…</div>;

  if (!allNews.length)
    return (
      <div className="container mt-5">
        <p>Belum ada berita.</p>
      </div>
    );

  const heroItems = allNews.slice(0, 4);
  const latest = allNews.slice(4);

  return (
    <div className="container mt-2 py-3 home">
      {/* Bagian hero atas */}
      <HeroMagazine items={heroItems} />

      {/* Semua berita ditampilkan penuh */}
      <h4 className="mt-4 mb-3">Semua Berita</h4>

      <section className="news-grid cards mb-5">
        {latest.map((n, idx) => {
          const id = n.news_id || n.id || idx;

          return (
            <Link
              key={id}
              to={`/detail/${id}`}
              className="card-news text-reset"
            >
              <div className="ratio-thumb">
                <img
                  src={imgOf(n)}
                  alt={n.news_title}
                  loading="lazy"
                  onError={(e) =>
                    (e.currentTarget.src = "/no-image.png")
                  }
                />
              </div>

              <div className="news-title line-2">{n.news_title}</div>

              <div className="text-muted small mt-1">
                <span className="badge bg-light text-dark me-2">
                  {getKategori(n)}
                </span>
                {formatWaktu(n)}
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
