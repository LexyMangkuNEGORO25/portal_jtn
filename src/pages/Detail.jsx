import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";

const res = await fetch(`${API_BASE}/api/news/detail/${id}`);
const API = import.meta.env.VITE_API_BASE || "https://devs.jtnapi.my.id/jtn";

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  //Pastikan hanya ambil angka ID meskipun URL mengandung slug
  const cleanId = id.split("/")[0];

  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recommended, setRecommended] = useState([]);
  const [trending, setTrending] = useState([]);

  // Ambil detail berita
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`${API}/news/detail/${cleanId}`);
        if (!res.ok) throw new Error("Gagal fetch detail berita");
        const data = await res.json();

        let cleanContent = (data.content || "")
          .replace(
            /https?:\/\/(?:www\.)?(jatimtimes|malangtimes|blitartimes|banyuwangitimes)\.com\/baca\/(\d+)/gi,
            (_, __, newsId) => `/detail/${newsId}`
          )
          .replace(
            /https?:\/\/(?:www\.)?(jatimtimes|malangtimes|blitartimes|banyuwangitimes)\.com\/tag\/([\w-]+)/gi,
            (_, __, slug) => `/tag/${slug}`
          )
          .replace(
            /https?:\/\/(?:www\.)?(jatimtimes|malangtimes|blitartimes|banyuwangitimes)\.com\/kategori\/([\w-]+)/gi,
            (_, __, slug) => `/kategori/${slug}`
          )
          .replace(
            /https?:\/\/(?:www\.)?(jatimtimes|malangtimes|blitartimes|banyuwangitimes)\.com(\/)?(?!\w)/gi,
            "/"
          )
          .trim();

        setNews({
          id: cleanId,
          title: data.title,
          date: data.date,
          writer: data.writer || "Redaksi JatimTIMES",
          image: data.image || "https://risetcdn.jatimtimes.com/images/logo.png",
          content: cleanContent || "<p>Isi berita tidak tersedia.</p>",
        });
      } catch (err) {
        console.error("Detail error:", err.message);
        navigate("/404");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [cleanId, navigate]);

  //Tambahkan watermark saat copy
  useEffect(() => {
    const handleCopy = (e) => {
      const selection = document.getSelection();
      if (!selection) return;
      const copiedText = selection.toString();
      if (!copiedText.trim()) return;

      const sourceText = `
\n\nArtikel ini telah tayang di JatimTIMES.com dengan judul "${
        news?.title || document.title
      }". 
Baca selengkapnya di: ${window.location.href}

Copyright © ${new Date().getFullYear()} JatimTIMES.
`;

      const clipboardData = e.clipboardData || window.clipboardData;
      clipboardData.setData("text/plain", copiedText + sourceText);
      e.preventDefault();
    };

    document.addEventListener("copy", handleCopy);
    return () => document.removeEventListener("copy", handleCopy);
  }, [news]);

  // 🔹 Ambil berita lain
  useEffect(() => {
    async function loadExtra() {
      try {
        const res = await fetch(`${API}/news`);
        const json = await res.json();
        const all = Array.isArray(json) ? json : json.data || [];

        if (Array.isArray(all) && all.length > 0) {
          const others = all.filter((n) => n.news_id !== cleanId);

          const recommendedItems = others.slice(4, 10).map((n) => ({
            id: n.news_id,
            title: n.news_title,
            image:
              n.news_image_new ||
              n.news_image ||
              "https://risetcdn.jatimtimes.com/images/logo.png",
          }));

          const trendingItems = others.slice(0, 6).map((n) => ({
            id: n.news_id,
            title: n.news_title,
            image:
              n.news_image_new ||
              n.news_image ||
              "https://risetcdn.jatimtimes.com/images/logo.png",
          }));

          setRecommended(recommendedItems);
          setTrending(trendingItems);
        }
      } catch (err) {
        console.error("Gagal memuat berita tambahan:", err.message);
      }
    }

    if (news && news.id) loadExtra();
  }, [news, cleanId]);

  if (loading)
    return (
      <div className="container text-center mt-5">
        <p>Memuat detail berita…</p>
      </div>
    );

  if (!news)
    return (
      <div className="container text-center mt-5">
        <p>Berita tidak ditemukan.</p>
      </div>
    );

  return (
    <div className="container detail-page mt-5 mb-5">
      <div className="row g-4">
        <div className="col-lg-8">
          <h2 className="fw-bold mb-2 text-start text-light">{news.title}</h2>
          <p className="text-muted mb-3 text-start">
            {news.date && `${news.date} • `}Penulis: {news.writer}
          </p>

          {news.image && (
            <div className="text-center mb-4">
              <img
                src={news.image}
                alt={news.title}
                className="img-fluid rounded shadow-sm"
                style={{
                  maxHeight: "500px",
                  objectFit: "cover",
                  width: "100%",
                }}
              />
            </div>
          )}

          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: news.content }}
          ></div>

          {recommended.length > 0 && (
            <div className="recommended-news mt-5">
              <h4 className="recommended-title">Pilihan Untukmu</h4>
              <div className="recommended-grid">
                {recommended.map((n) => (
                  <Link
                    key={n.id}
                    to={`/detail/${n.id}`}
                    className="recommended-card"
                  >
                    <div className="rec-thumb">
                      <img src={n.image} alt={n.title} loading="lazy" />
                    </div>
                    <p className="rec-title">{n.title}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="col-lg-4">
          <div className="trending-box">
            <h4 className="trending-title">Berita Terbaru</h4>
            {trending.length > 0 ? (
              trending.map((t) => (
                <Link key={t.id} to={`/detail/${t.id}`} className="trend-item">
                  <img src={t.image} alt={t.title} loading="lazy" />
                  <p>{t.title}</p>
                </Link>
              ))
            ) : (
              <p className="text-muted small">Belum ada berita trending.</p>
            )}
          </div>

          <div className="sidebar-ads mt-4">
            <img src="/ads/iklanvertikal.jpg" alt="Iklan Vertikal" />
          </div>
          <div className="sidebar-ads mt-4">
            <img src="/ads/iklanforex.jpg" alt="Iklan Forex" />
          </div>
        </div>
      </div>
    </div>
  );
}
