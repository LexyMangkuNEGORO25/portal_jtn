import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import RightRailAds from "../components/RightRailAds";
import { API_BASE, IMAGE_BASE } from "../config/api";


export default function CategoryPage({
  title = "Berita",
  slugs = null,
  popularCount = 6,
}) {
  const [items, setItems] = useState([]);
  const [popular, setPopular] = useState([]);
  const [latest, setLatest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [params] = useSearchParams();
  const q = (params.get("q") || "").trim();

  const normalize = (payload) =>
    Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.data)
      ? payload.data
      : [];

  const imgOf = (n) => {
    let url =
      n?.news_image_new || n?.news_image || n?.thumbnail || n?.image || n?.photo || "";
    if (!url || url === "null" || url.trim() === "") {
      return "https://risetcdn.jatimtimes.com/images/logo.png";
    }
    url = url.trim().replace(/^\/+/, "");
    if (!/^https?:\/\//i.test(url)) {
      url = `https://risetcdn.jatimtimes.com/${url}`;
    }
    return url;
  };

  const descOf = (n) => n?.news_description || n?.news_caption || n?.news_desc || "";
  const parseDate = (n) => Date.parse(n?.news_datepub || n?.date || 0) || 0;

  const formatWaktu = (n) => {
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
  };

  const getKategori = (n) =>
    n?.category?.name ||
    n?.category_name ||
    n?.news_category ||
    n?.news_category_name ||
    n?.rubric ||
    n?.rubric_name ||
    title;

  async function fetchNews() {
    const slug = Array.isArray(slugs) && slugs.length ? slugs[0] : null;
    const url = slug ? api(`/api/news/category/${slug}`) : api(`/api/news`);
    const res = await fetch(url);
    const json = await res.json();
    return normalize(json);
  }

  async function fetchLatest() {
    const res = await fetch(api(`/api/news`));
    const json = await res.json();
    return normalize(json);
  }

  useEffect(() => {
    let alive = true;
    async function run() {
      setLoading(true);
      setErr("");
      try {
        const [catData, latestData] = await Promise.all([
          fetchNews(),
          fetchLatest(),
        ]);
        if (!alive) return;
        setItems(catData);
        setPopular(catData.slice(0, popularCount));
        setLatest(latestData.slice(0, 4));
      } catch (e) {
        console.error(e);
        if (alive) setErr("Gagal memuat berita kategori.");
      } finally {
        if (alive) setLoading(false);
      }
    }
    run();
    return () => {
      alive = false;
    };
  }, [slugs]);

  const filtered = useMemo(() => {
    if (!q) return items;
    const s = q.toLowerCase();
    return items.filter(
      (n) =>
        (n.news_title || "").toLowerCase().includes(s) ||
        (descOf(n) || "").toLowerCase().includes(s)
    );
  }, [q, items]);

  const hero = filtered[0];
  const others = filtered.slice(1);

  return (
    <div className="k-page">
      <h2 className="section-title container">{title}</h2>

      <div className="container">
        {!loading && hero && (
          <div className="news-hero mb-5 fade-in">
            <Link
              to={`/detail/${hero.news_id || hero.id || hero.slug}`}
              className="hero-wrapper"
            >
              <img
                src={imgOf(hero)}
                alt={hero.news_title}
                onError={(e) =>
                  (e.currentTarget.src =
                    "https://risetcdn.jatimtimes.com/images/logo.png")
                }
                loading="lazy"
                className="hero-image"
              />
              <div className="hero-gradient" />
              <div className="hero-meta">
                <span className="hero-category">
                  {getKategori(hero)} • {formatWaktu(hero)}
                </span>
                <h3 className="hero-headline">{hero.news_title}</h3>
              </div>
            </Link>
          </div>
        )}

        {loading && items.length === 0 ? (
          <p>Memuat berita…</p>
        ) : err ? (
          <p className="text-danger">{err}</p>
        ) : (
          <div className="row g-4">
            <div className="col-lg-8">
              <section className="news-grid cards">
                {others.map((n) => {
                  const key = n.news_id || n.id || n.slug;
                  return (
                    <Link
                      key={key}
                      to={`/detail/${key}`}
                      className="card-news text-reset fade-in"
                    >
                      <div className="ratio-thumb" style={{ aspectRatio: "16/9" }}>
                        <img
                          src={imgOf(n)}
                          alt={n.news_title}
                          loading="lazy"
                          onError={(e) =>
                            (e.currentTarget.src =
                              "https://risetcdn.jatimtimes.com/images/logo.png")
                          }
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
                })}
              </section>

              <div className="mt-5 pt-3 border-top">
                <h4 className="section-title">Berita Terbaru</h4>
                {latest.length > 0 ? (
                  <div className="news-grid cards">
                    {latest.map((n) => (
                      <Link
                        key={n.news_id}
                        to={`/detail/${n.news_id}`}
                        className="card-news text-reset fade-in"
                      >
                        <div className="ratio-thumb" style={{ aspectRatio: "16/9" }}>
                          <img
                            src={imgOf(n)}
                            alt={n.news_title}
                            loading="lazy"
                          />
                        </div>
                        <div className="p-3">
                          <div className="news-title fw-bold line-2">
                            {n.news_title}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted">Tidak ada berita terbaru.</p>
                )}
              </div>
            </div>

            <div className="col-lg-4">
              <RightRailAds trending={popular} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
