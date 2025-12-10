// import { useEffect, useState } from "react";

// export default function ScrollUpDown() {
//   const [atTop, setAtTop] = useState(true);
//   const [atBottom, setAtBottom] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       const y = window.scrollY || document.documentElement.scrollTop;
//       const max =
//         document.documentElement.scrollHeight -
//         document.documentElement.clientHeight -
//         5;
//       setAtTop(y <= 10);
//       setAtBottom(y >= max);
//     };

//     handleScroll();
//     window.addEventListener("scroll", handleScroll, { passive: true });
//     window.addEventListener("resize", handleScroll);

//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//       window.removeEventListener("resize", handleScroll);
//     };
//   }, []);

//   const scrollSmooth = (dir) => {
//     const step = Math.round(window.innerHeight * 0.85);
//     window.scrollBy({ top: dir * step, behavior: "smooth" });
//   };

//   return (
//     <div
//       className="k-scroll-ud"
//       style={{
//         position: "fixed",
//         display: "flex",
//         flexDirection: "column",
//         gap: "12px",
//         bottom: "20px",
//         right: "20px",
//         zIndex: 999999,
//         pointerEvents: "auto",
//         touchAction: "manipulation",
//       }}
//     >
//       <button
//         className={`k-ud-btn up ${atTop ? "disabled" : ""}`}
//         onClick={() => scrollSmooth(-1)}
//         disabled={atTop}
//       >
//         ▲
//       </button>

//       <button
//         className={`k-ud-btn down ${atBottom ? "disabled" : ""}`}
//         onClick={() => scrollSmooth(1)}
//         disabled={atBottom}
//       >
//         ▼
//       </button>
//     </div>
//   );
// }
