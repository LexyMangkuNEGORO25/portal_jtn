// src/App.jsx
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

// Komponen utama
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import SocialMedia from "./components/SocialMedia"; 

// Halaman utama
import Content from "./pages/Content";
import Detail from "./pages/Detail";
import TentangKami from "./pages/Tentangkami";
import Bantuan from "./pages/Bantuan";
import Pencarian from "./pages/Pencarian";

// Halaman kebijakan
import Privacy from "./pages/Privacy";
import Syarat from "./pages/Syarat";

// Kategori berita
import Ekonomi from "./pages/Projects";
import Kuliner from "./pages/Kuliner";
import Teknologi from "./pages/Teknologi";
import Politik from "./pages/Politik";
import Olahraga from "./pages/Olahraga";
import Selebriti from "./pages/Selebriti";
import RuangMahasiswa from "./pages/Ruangmahasiswa";
import Sastra from "./pages/Sastra"; 
import Kesehatan from "./pages/Kesehatan";
import Agama from "./pages/Agama";
import Peristiwa from "./pages/Peristiwa";
import Wisata from "./pages/Wisata";
import Transportasi from "./pages/Transportasi";
import Pendidikan from "./pages/Pendidikan";
import Opini from "./pages/Opini";

// Halaman ketika URL tidak ditemukan
function NotFound() {
  return (
    <div className="container my-5 text-center">
      <h2>Halaman tidak ditemukan</h2>
      <p>Periksa kembali alamat URL yang dimasukkan.</p>
    </div>
  );
}

// Layout umum untuk semua halaman
function PageLayout() {
  return (
    <>
      {/* Navigasi di bagian atas */}
      <Navigation />

      {/* Jarak tambahan agar konten tidak tertutup navbar */}
      <div className="k-header-offset" />
      <div className="k-header-gap" />

      {/* Tombol media sosial di sisi kanan layar */}
      <SocialMedia />

      {/* Area utama konten halaman */}
      <main className="k-page pt-3 mt-2">
        <Outlet />
      </main>

      {/* Bagian footer di bawah halaman */}
      <Footer />
    </>
  );
}

// Routing utama aplikasi
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PageLayout />}>
          {/* Halaman utama */}
          <Route path="/" element={<Content />} />
          <Route path="/content" element={<Content />} />

          {/* Kategori */}
          <Route path="/ekonomi" element={<Ekonomi />} />
          <Route path="/kuliner" element={<Kuliner />} />
          <Route path="/teknologi" element={<Teknologi />} />
          <Route path="/politik" element={<Politik />} />
          <Route path="/ruangmahasiswa" element={<RuangMahasiswa />} />
          <Route path="/ruangsastra" element={<Sastra />} />
          <Route path="/olahraga" element={<Olahraga />} />
          <Route path="/selebriti" element={<Selebriti />} />
          <Route path="/kesehatan" element={<Kesehatan />} />
          <Route path="/agama" element={<Agama />} />
          <Route path="/peristiwa" element={<Peristiwa />} />
          <Route path="/wisata" element={<Wisata />} />
          <Route path="/transportasi" element={<Transportasi />} />
          <Route path="/pendidikan" element={<Pendidikan />} />
          <Route path="/opini" element={<Opini />} />

          {/* Halaman tambahan */}
          <Route path="/pencarian" element={<Pencarian />} />
          <Route path="/tentangkami" element={<TentangKami />} />
          <Route path="/bantuan" element={<Bantuan />} />

          {/* Halaman detail berita (mendukung slug tambahan di URL) */}
          <Route path="/detail/:id/*" element={<Detail />} />

          {/* Kebijakan dan syarat */}
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/syarat" element={<Syarat />} />

          {/* Halaman 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
