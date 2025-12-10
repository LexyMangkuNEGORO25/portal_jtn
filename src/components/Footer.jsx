import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer mt-5 pt-5">
      <div className="container">
        <div className="row">
          {/* Kolom Logo dan Info */}
          <div className="col-md-3 mb-4 text-center">
            <img
              src="/logo-jatimtimes.png"
              alt="Logo Jatim Times"
              style={{ maxHeight: "60px", marginBottom: "1rem" }}
            />
            <p style={{ fontSize: "0.9rem", color: "#ccc" }}>
              © 2025 JatimTIMES. All rights reserved.
            </p>
          </div>

          {/* Kolom Navigasi */}
          <div className="col-md-3 d-flex flex-column mb-3">
            <h5 className="text-white mb-3">Navigasi</h5>
            <Link to="/privacy" className="text-white text-decoration-none mb-1">
              Kebijakan Privasi
            </Link>
            <Link to="/syarat" className="text-white text-decoration-none mb-1">
              Syarat & Ketentuan
            </Link>
            <Link to="/tentangkami" className="text-white text-decoration-none mb-1">
              Tentang Kami
            </Link>
            <Link to="/bantuan" className="text-white text-decoration-none mb-1">
              Bantuan
            </Link>
          </div>

          {/* Kolom Kategori */}
          <div className="col-md-3 d-flex flex-column mb-3">
            <h5 className="text-white mb-3">Kategori</h5>
            <Link to="/politik" className="text-white text-decoration-none mb-1">Politik</Link>
            <Link to="/ekonomi" className="text-white text-decoration-none mb-1">Ekonomi</Link>
            <Link to="/teknologi" className="text-white text-decoration-none mb-1">Teknologi</Link>
            <Link to="/kuliner" className="text-white text-decoration-none mb-1">Kuliner</Link>
            <Link to="/ruangmahasiswa" className="text-white text-decoration-none mb-1">Mahasiswa</Link>
            <Link to="/olahraga" className="text-white text-decoration-none mb-1">Olahraga</Link>
            <Link to="/selebriti" className="text-white text-decoration-none mb-1">Selebriti</Link>
            <Link to="/kesehatan" className="text-white text-decoration-none mb-1">Kesehatan</Link>
            <Link to="/agama" className="text-white text-decoration-none mb-1">Agama</Link>
            <Link to="/peristiwa" className="text-white text-decoration-none mb-1">Peristiwa</Link>
            <Link to="/wisata" className="text-white text-decoration-none mb-1">Wisata</Link>
            <Link to="/transportasi" className="text-white text-decoration-none mb-1">Transportasi</Link>
            <Link to="/pendidikan" className="text-white text-decoration-none mb-1">Pendidikan</Link>
          </div>

          {/* Kolom Kontak */}
          <div className="col-md-3 mb-4">
            <h5 className="text-white mb-3">Kontak Redaksi</h5>
            <p>
              Email:{" "}
              <a href="mailto:redaksi@jatimtimes.com" className="text-white text-decoration-none">
                redaksi@jatimtimes.com
              </a>
            </p>
            <p>Telp/WhatsApp: (+62) 811-3787-823</p>
            <p>
              Ruko Tlogomas Square Kav. 14, Jalan Raya Tlogomas, Kecamatan
              Lowokwaru, Kota Malang, Jawa Timur 65144, Indonesia.
            </p>
          </div>
        </div>

        {/* Tambahan keterangan Dewan Pers */}
        <div className="text-center mt-4">
          <img
            src="/dewanpers.png"
            alt="Logo Dewan Pers"
            style={{ maxHeight: "100px", marginBottom: "1rem" }}
          />
          <p
            style={{
              fontSize: "1rem",
              color: "#ccc",
              maxWidth: "900px",
              margin: "0 auto",
            }}
          >
            <strong>Jatim Times Network</strong> adalah media online yang telah
            terverifikasi <strong>Dewan Pers</strong> dengan nomor{" "}
            <span style={{ color: "#0d6efd" }}>794/DP-Verifikasi/K/X/2021</span>.
            Kami berkomitmen menyajikan berita yang akurat, independen, dan terpercaya.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
