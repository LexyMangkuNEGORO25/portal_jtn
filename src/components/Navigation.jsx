import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import { ChevronLeft, ChevronRight } from "lucide-react";

const categories = [
  { to: "/", label: "Beranda" },
  { to: "/ekonomi", label: "Ekonomi" },
  { to: "/kuliner", label: "Kuliner" },
  { to: "/politik", label: "Politik" },
  { to: "/ruangmahasiswa", label: "Ruang Mahasiswa" },
  { to: "/ruangsastra", label: "Ruang Sastra" },
  { to: "/olahraga", label: "Olahraga" },
  { to: "/selebriti", label: "Selebriti" },
  { to: "/kesehatan", label: "Kesehatan" },
  { to: "/agama", label: "Agama" },
  { to: "/pendidikan", label: "Pendidikan" },
  { to: "/peristiwa", label: "Peristiwa" },
  { to: "/wisata", label: "Wisata" },
  { to: "/transportasi", label: "Transportasi" },
  { to: "/opini", label: "Opini" },
  { to: "/teknologi", label: "Teknologi" },
];

const API_BASE = `http://${window.location.hostname}:5000/api`;

export default function Navigation() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [term, setTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openSuggest, setOpenSuggest] = useState(false);

  const navScrollRef = useRef(null);

  // Pencarian berita sesuai keyword pengguna
  useEffect(() => {
    const q = term.trim();
    if (!q) {
      setResults([]);
      setOpenSuggest(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/news/search`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ keyword: q }),
          signal: controller.signal,
        });

        const data = await res.json();
        const hasil = Array.isArray(data)
          ? data.slice(0, 15)
          : Array.isArray(data.data)
          ? data.data.slice(0, 15)
          : [];

        setResults(hasil);
        setOpenSuggest(true);
      } catch (err) {
        console.error("Gagal mengambil hasil pencarian:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 500); // waktu tunda 500ms (debounce)

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [term]);

  // Navigasi ke detail berita
  const goDetail = (id) => {
    setOpenSuggest(false);
    setTerm("");
    navigate(`/detail/${id}`);
  };

  // Fungsi scroll horizontal navbar kategori
  const scrollNav = (dir) => {
    if (navScrollRef.current) {
      navScrollRef.current.scrollBy({
        left: dir === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <div style={{ height: 120 }} />

      <header className="nav-header">
        <div className="desktop-header">
          {/* Logo di kiri */}
          <Link to="/" className="nav-logo-wrapper">
            <img
              src="/logo-jatimtimes.png"
              alt="JatimTIMES"
              className="nav-logo"
            />
          </Link>

          {/* Kolom pencarian */}
          <div
            className="nav-search"
            style={{
              marginLeft: "auto",
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <SearchBar
              value={term}
              onChange={(v) => {
                setTerm(v);
                if (!v.trim()) setOpenSuggest(false);
              }}
            />

            {openSuggest && (
              <div className="search-suggest">
                {loading ? (
                  <div className="search-item">Mencari berita...</div>
                ) : results.length > 0 ? (
                  results.map((r, i) => (
                    <div
                      key={r.news_id || i}
                      className="search-item clickable"
                      onClick={() => goDetail(r.news_id)}
                    >
                      <div className="search-title">
                        {r.news_title?.length > 60
                          ? r.news_title.slice(0, 60) + "..."
                          : r.news_title}
                      </div>
                      <div className="search-date">
                        {r.news_datepub?.slice(0, 10) || ""}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="search-item">Tidak ada hasil ditemukan.</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Navbar kategori yang bisa di-scroll */}
        <div className="nav-scroll-container">
          <button className="nav-arrow left" onClick={() => scrollNav("left")}>
            <ChevronLeft size={20} />
          </button>

          <div className="k-nav-scroll" ref={navScrollRef}>
            <nav className="k-nav">
              {categories.map((c) => (
                <Link
                  key={c.to}
                  to={c.to}
                  className={`nav-link-item ${
                    pathname === c.to ? "active orange-active" : ""
                  }`}
                >
                  {c.label}
                </Link>
              ))}
            </nav>
          </div>

          <button className="nav-arrow right" onClick={() => scrollNav("right")}>
            <ChevronRight size={20} />
          </button>
        </div>
      </header>
    </>
  );
}
