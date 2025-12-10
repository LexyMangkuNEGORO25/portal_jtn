import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const API = `http://${window.location.hostname}:5000`;
const IMAGE_BASE = "https://devs.jtnapi.my.id";

// Fungsi untuk menampilkan gambar dengan aman
const imgOf = (n) => {
  let raw = n?.news_image_new || n?.news_image;
  if (!raw || raw === "null" || raw.trim() === "") {
    return "/uploads/no-image.png";
  }
  raw = raw.replace(/\\/g, "/");
  if (!raw.startsWith("http")) {
    if (raw.includes("uploads")) {
      return `${IMAGE_BASE}${raw.startsWith("/") ? "" : "/"}${raw}`;
    }
    return `${IMAGE_BASE}/uploads/${raw}`;
  }
  return raw;
};

export default function Pencarian() {
  const [params] = useSearchParams();
  const q = (params.get("q") || "").trim();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!q) return;

    async function search() {
      try {
        setLoading(true);
        const res = await fetch(`${API}/api/news`);
        const json = await res.json();

        const list = Array.isArray(json)
          ? json
          : Array.isArray(json?.data)
          ? json.data
          : [];

        const keyword = q.toLowerCase();

        //  Cari di title dan deskripsi
        const hasil = list.filter(
          (n) =>
            (n.news_title || "").toLowerCase().includes(keyword) ||
            (n.news_description || "").toLowerCase().includes(keyword)
        );

        setItems(hasil);
      } catch (e) {
        console.error(" Error pencarian:", e);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }

    search();
  }, [q]);

  if (!q)
    return <div className="container mt-5">Masukkan kata kunci pencarian.</div>;

  return (
    <div className="container mt-3">
      <h3 className="mb-3">
        Hasil pencarian: <strong>{q}</strong>
      </h3>

      {loading ? (
        <p>Memuat...</p>
      ) : !items.length ? (
        <p>Tidak ditemukan berita untuk kata kunci tersebut.</p>
      ) : (
        <div className="news-grid cards">
          {items.map((n, idx) => {
            const id = n.news_id || n.id || idx;
            return (
              <Link key={id} to={`/detail/${id}`} className="card-news text-reset">
                <div className="ratio-thumb">
                  <img
                    src={imgOf(n)}
                    alt={n.news_title}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = "/uploads/no-image.png";
                      e.currentTarget.onerror = null;
                    }}
                  />
                </div>
                <div className="news-title line-2">{n.news_title}</div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
