import React from "react";
import { createPortal } from "react-dom";
import { FaFacebookF, FaTiktok, FaYoutube, FaLink } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";

// Fungsi untuk membuka link di tab baru
const open = (url) => window.open(url, "_blank", "noopener,noreferrer");

// URL resmi terbaru JatimTIMES
const LINKS = {
  ig: "https://www.instagram.com/jatimtimescom/",
  fb: "https://web.facebook.com/jatimtimesnetwork/?_rdc=1&_rdr#",
  tt: "https://www.tiktok.com/@jatimtimes2", // TikTok baru
  yt: "https://www.youtube.com/c/JatimTIMESNetworkOfficialVideos",
};

// Fungsi untuk menyalin tautan halaman saat ini
const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    alert("Tautan berhasil disalin");
  } catch {
    prompt("Salin tautan ini:", window.location.href);
  }
};

// Komponen utama tombol sosial media
function Bar() {
  return (
    <div
      className="social-fixed"
      role="complementary"
      aria-label="Ikuti & bagikan"
    >
      <button
        className="sbtn"
        aria-label="Instagram"
        onClick={() => open(LINKS.ig)}
      >
        <RiInstagramFill />
      </button>

      <button
        className="sbtn"
        aria-label="Facebook"
        onClick={() => open(LINKS.fb)}
      >
        <FaFacebookF />
      </button>

      <button
        className="sbtn"
        aria-label="TikTok"
        onClick={() => open(LINKS.tt)}
      >
        <FaTiktok />
      </button>

      <button
        className="sbtn"
        aria-label="YouTube"
        onClick={() => open(LINKS.yt)}
      >
        <FaYoutube />
      </button>

      <button className="sbtn" aria-label="Salin tautan" onClick={copyLink}>
        <FaLink />
      </button>
    </div>
  );
}

// Gunakan portal agar tombol sosial media selalu muncul di atas layout
export default function SocialMedia() {
  return createPortal(<Bar />, document.body);
}
