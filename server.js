import express from "express";
import axios from "axios";
import cors from "cors";
import os from "os";

const app = express();
const PORT = 5000;

// Konfigurasi Middleware
app.use(cors());
app.use(express.json());

// Pengaturan dasar API
const API_BASE = "https://devs.jtnapi.my.id/jtn";
const AUTH = {
  username: "devjtn",
  password: "BismillahDuluBrowh!#2025",
};

// Fungsi untuk mendapatkan IP lokal
function getLocalIp() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "localhost";
}

// Fungsi untuk menyesuaikan gambar berita
function normalizeNewsImage(item, categoryName = "") {
  const sastraImages = [
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
    "https://images.unsplash.com/photo-1519682337058-a94d519337bc",
    "https://images.unsplash.com/photo-1507842217343-583bb7270b66",
    "https://images.unsplash.com/photo-1455390582262-044cdead277a",
    "https://images.unsplash.com/photo-1526318472351-bc6fa97e7f6f",
  ];

  let img =
    item.news_image_new ||
    item.news_image ||
    item.image ||
    item.thumbnail ||
    "";

  const isSastra =
    categoryName.toLowerCase().includes("sastra") ||
    (item.news_title &&
      /(sastra|puisi|cerpen|novel|literasi|ruang sastra)/i.test(
        item.news_title
      ));

  if (
    !img ||
    img === "null" ||
    img.trim() === "" ||
    img.includes("risetcdn.jatimtimes.com/images/logo.png")
  ) {
    img = isSastra
      ? sastraImages[Math.floor(Math.random() * sastraImages.length)]
      : "https://risetcdn.jatimtimes.com/images/logo.png";
  }

  return {
    ...item,
    news_image_new: img,
    news_image: img,
  };
}

// Endpoint: Menampilkan semua berita
app.get("/api/news", async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE}/news/all`, {
      auth: AUTH,
      timeout: 20000,
      headers: { "User-Agent": "JTN-Proxy-Server" },
    });

    const data = Array.isArray(response.data)
      ? response.data
      : Array.isArray(response.data.data)
      ? response.data.data
      : [];

    res.json(data.map((d) => normalizeNewsImage(d)));
  } catch (error) {
    console.error("Gagal mengambil semua berita:", error.message);
    res.status(500).json({ error: "Gagal mengambil data berita." });
  }
});

// Endpoint: Menampilkan detail berita
app.get("/api/news/detail/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${API_BASE}/news/detail?id=${id}`, {
      auth: AUTH,
      timeout: 20000,
      headers: { "User-Agent": "JTN-Proxy-Server" },
    });

    const data = response.data;
    const item =
      data?.data?.[0] || data?.data || data?.[0] || data?.["0"] || data || {};

    if (!item || !item.news_title) {
      return res.status(404).json({
        id,
        title: "Berita Tidak Ditemukan",
        writer: "Redaksi JatimTIMES",
        date: "",
        image: "https://risetcdn.jatimtimes.com/images/logo.png",
        content: "<p>Berita tidak tersedia.</p>",
      });
    }

    const content = [
      item.news_subtitle,
      item.news_description,
      item.news_description_full,
      item.news_content,
    ]
      .filter((t) => typeof t === "string" && t.trim() !== "")
      .join("<br><br>");

    const fixedItem = {
      id: item.news_id,
      title: item.news_title,
      date: item.news_datepub || "",
      writer: item.news_writer || "Redaksi JatimTIMES",
      image: normalizeNewsImage(item).news_image_new,
      content: content || "<p>Isi berita tidak tersedia.</p>",
    };

    res.json(fixedItem);
  } catch (error) {
    console.error("Gagal mengambil detail berita:", error.message);
    res.status(500).json({ error: "Gagal mengambil detail berita." });
  }
});

// Endpoint: Berita berdasarkan kategori
app.get("/api/news/category/:name", async (req, res) => {
  const { name } = req.params;
  try {
    const response = await axios.get(
      `${API_BASE}/news/category/${encodeURIComponent(name)}`,
      {
        auth: AUTH,
        timeout: 25000,
        headers: { "User-Agent": "JTN-Proxy-Server" },
      }
    );

    const data = Array.isArray(response.data)
      ? response.data
      : Array.isArray(response.data.data)
      ? response.data.data
      : [];

    res.json(data.map((d) => normalizeNewsImage(d, name)).slice(0, 20));
  } catch (error) {
    console.error(`Gagal mengambil kategori '${name}':`, error.message);
    res.json([]);
  }
});

// Endpoint: Fitur Pencarian Berita
app.post("/api/news/search", async (req, res) => {
  try {
    let keyword = req.body?.news_title || req.body?.keyword || "";
    keyword = keyword.trim();

    if (!keyword) {
      return res.status(400).json({ error: "Masukkan kata kunci pencarian." });
    }

    const response = await axios.get(`${API_BASE}/news/all`, {
      auth: AUTH,
      timeout: 20000,
      headers: { "User-Agent": "JTN-Proxy-Server" },
    });

    let all = [];
    if (Array.isArray(response.data)) {
      all = response.data;
    } else if (Array.isArray(response.data?.data)) {
      all = response.data.data;
    } else if (Array.isArray(response.data?.data?.data)) {
      all = response.data.data.data;
    }

    const filtered = all.filter((n) => {
      const text = (
        n.news_title ||
        n.title ||
        n.news_subtitle ||
        n.news_description ||
        n.news_description_full ||
        n.news_content ||
        ""
      ).toLowerCase();
      return text.includes(keyword.toLowerCase());
    });

    const result = filtered.map((d) => normalizeNewsImage(d)).slice(0, 20);
    console.log(`Pencarian: "${keyword}" | Hasil: ${result.length}`);
    res.json(result);
  } catch (error) {
    console.error("Gagal melakukan pencarian:", error.message);
    res.status(500).json({ error: "Terjadi kesalahan saat mencari berita." });
  }
});

// Endpoint: Health Check
app.get("/", (req, res) => {
  res.send("Server Proxy JatimTIMES aktif dan berjalan dengan baik.");
});

// Menjalankan server
const localIp = getLocalIp();
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server JatimTIMES Proxy berjalan di:");
  console.log(`  - http://localhost:${PORT}`);
  console.log(`  - http://${localIp}:${PORT} (akses dari perangkat lain)`);
});
