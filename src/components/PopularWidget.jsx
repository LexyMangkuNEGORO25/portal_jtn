// src/components/PopularWidget.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Ganti jika endpoint API berbeda
const API_BASE = "http://localhost:5000";

/**
 * Widget "Terpopuler" lintas kategori, disortir berdasarkan jumlah views.
 * - days: jendela waktu dalam hari (7 = 7 hari terakhir; 0 = all time)
 * - limit: jumlah item yang ditampilkan
 * - sticky: beri posisi sticky di sidebar (ikuti CSS yang sudah ada)
 */
export default function PopularWidget({ sticky = false, limit = 8, days = 7 }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const ac = new AbortController();
    setLoading(true);
    setErr("");

    fetch(`${API_BASE}/api/news`, { signal: ac.signal })
      .then((r) => r.json())
      .then((d) => {
        const raw = Array.isArray(d) ? d : Array.isArray(d?.data) ? d.data : [];

        // Normalisasi agar seragam
        const normalized = raw.map((n) => ({
          id:
            n.news_id ??
            n.id ??
            n._id ??
            n.slug ??
            Math.random().toString(36).slice(2),
          title: n.news_title || "",
          img: n.news_image_new || n.news_image || "/no-image.png",
          views:
            typeof n?.news_view === "number"
              ? n.news_view
              : parseInt(n?.news_view, 10) || 0,
          date:
            Date.parse(n?.news_datepub ?? n?.date ?? n?.created_at ?? 0) || 0,
        }));

        // Filter by jangka waktu (hari)
        const now = Date.now();
        const windowMs = days > 0 ? days * 24 * 60 * 60 * 1000 : 0;
        const pool =
          windowMs > 0
            ? normalized.filter((x) => now - x.date <= windowMs)
            : normalized;

        // Sort: views desc lalu tanggal desc
        pool.sort((a, b) => (b.views - a.views) || (b.date - a.date));

        // Dedupe judul agar tak dobel
        const seen = new Set();
        const top = [];
        for (const it of pool) {
          const key = it.title.trim().toLowerCase();
          if (!key || seen.has(key)) continue;
          seen.add(key);
          top.push(it);
          if (top.length >= limit) break;
        }

        setItems(top);
      })
      .catch((e) => {
        if (e.name !== "AbortError") setErr("Gagal memuat daftar terpopuler.");
      })
      .finally(() => setLoading(false));

    return () => ac.abort();
  }, [limit, days]);

  return (
    <aside className={`popular-box ${sticky ? "sidebar-sticky" : ""}`}>
      <h5 className="mb-3">Terpopuler</h5>

      {loading && <div className="text-muted small">Memuat…</div>}
      {err && <div className="text-danger small">{err}</div>}

      {!loading && !err && items.length > 0 && (
        <div className="news-list">
          {items.map((n) => (
            <Link key={n.id} to={`/detail/${n.id}`} className="popular-item">
              <div className="popular-thumb">
                <img
                  src={n.img}
                  alt={n.title}
                  onError={(e) => {
                    e.currentTarget.src = "/no-image.png";
                    e.currentTarget.onerror = null;
                  }}
                />
              </div>
              <div className="popular-title line-2">{n.title}</div>
            </Link>
          ))}
        </div>
      )}

      {!loading && !err && items.length === 0 && (
        <div className="text-muted small">Belum ada data.</div>
      )}
    </aside>
  );
}
