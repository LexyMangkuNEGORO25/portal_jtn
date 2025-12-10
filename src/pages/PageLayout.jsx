import { Outlet } from "react-router-dom";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import SocialMedia from "../components/SocialMedia";
import AdSlot from "../components/AdSlot";

export default function PageLayout() {
  return (
    <>
      <Navigation />
      {/* Spacer untuk header fixed */}
      <div className="k-header-offset" />

      <SocialMedia />

      {/* Leaderboard di bawah header */}
      <div className="k-leader container">
        <AdSlot type="leaderboard" />
      </div>

      {/* Konten utama (tema terang, tanpa theme-kompas) */}
      <main>
        <div className="container py-3">
          <div className="row g-4">
            {/* Konten kiri */}
            <div className="col-lg-8">
              <Outlet />
            </div>

            {/* Sidebar kanan sticky */}
            <div className="col-lg-4">
              <aside className="k-sidebar sidebar-sticky">
                <div className="mb-3">
                  <AdSlot type="mrecSmall" />
                </div>
                <div className="d-none d-xl-block">
                  <AdSlot type="skyscraper" />
                </div>
              </aside>
            </div>
          </div>
        </div>
      </main>

      {/* Anchor ad di mobile */}
      <div className="ad-anchor d-lg-none">
        <AdSlot type="anchor" />
      </div>

      <Footer />
    </>
  );
}
