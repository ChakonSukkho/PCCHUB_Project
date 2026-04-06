import { useEffect, useRef, useState } from "react";

// ── floating gallery images (replace URLs with your real uploads) ──────────
const GALLERY = [
  "uploads/pcc/pccactivity.jpg",
  "uploads/pcc/2.jpg",
  "uploads/pcc/3.jpg",
  "uploads/pcc/1.jpg",
  "uploads/pcc/5.jpg",
  "uploads/pcc/pccCommuniti.jpg",
  "uploads/pcc/pccprogram.jpg",
  "uploads/pcc/pccEvent.jpg",
  "uploads/pcc/pccImg.jpg",
];

const ROW_CFG = [
  { y: "6%",  speed: 55 },
  { y: "38%", speed: 42 },
  { y: "70%", speed: 50 },
];

const FEATURES = [
  { icon: "📚", title: "Academic Excellence", desc: "Track your courses, grades, and academic progress in real time." },
  { icon: "👥", title: "Community",           desc: "Connect and collaborate with peers across all programs." },
  { icon: "📖", title: "Resources",           desc: "Access study materials, announcements, and campus info." },
  { icon: "👤", title: "Personal",            desc: "Manage your profile, merit points, and activity history." },
];

// ── FloatingBg ─────────────────────────────────────────────────────────────
function FloatingBg() {
  const containerRef = useRef(null);
  const stateRef     = useRef([]);
  const rafRef       = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const CARD_W = 340, GAP = 48;
    const imgs   = [...container.querySelectorAll(".fi")];

    // assign rows (3 rows: 3 / 3 / 3)
    const splits = [3, 3, 3];
    let idx = 0;
    const rowItems = splits.map((count, r) =>
      imgs.slice(idx, (idx += count)).map((el) => ({ el, row: r, x: 0 }))
    );

    const all = rowItems.flat();

    function layout() {
      const period = window.innerWidth + CARD_W + GAP;
      rowItems.forEach((items, r) => {
        const step = period / items.length;
        items.forEach((it, i) => {
          it.period = period;
          it.x      = -CARD_W + i * step;
          it.el.style.top = ROW_CFG[r].y;
        });
      });
    }

    layout();
    const onResize = () => layout();
    window.addEventListener("resize", onResize);

    let last = performance.now();
    function frame(t) {
      const dt = (t - last) / 1000;
      last = t;
      all.forEach((it) => {
        const r = it.row;
        it.x += ROW_CFG[r].speed * dt;
        if (it.x > it.period) it.x -= it.period;
        it.el.style.transform = `translateX(${it.x}px)`;
      });
      rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed", inset: 0, zIndex: 0, overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {GALLERY.map((src, i) => (
        <div
          key={i}
          className="fi"
          style={{
            position: "absolute",
            width: 340, height: 220,
            borderRadius: 16,
            backgroundImage: `url(${src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.18,
            filter: "saturate(0.6) brightness(0.8)",
            willChange: "transform",
          }}
        />
      ))}
    </div>
  );
}

// ── LoginModal ──────────────────────────────────────────────────────────────
function LoginModal({ open, onClose }) {
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(2,9,23,0.82)",
        backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        animation: "fadeIn .25s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "rgba(10,20,40,0.95)",
          border: "1px solid rgba(56,189,248,0.2)",
          borderRadius: 20,
          padding: "2.5rem",
          width: "min(92vw, 420px)",
          boxShadow: "0 0 60px rgba(14,165,233,0.15)",
          animation: "slideUp .3s ease",
        }}
      >
        {/* close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 16, right: 20,
            background: "none", border: "none",
            color: "#94a3b8", fontSize: 22, cursor: "pointer", lineHeight: 1,
          }}
        >
          ×
        </button>

        <p style={{ fontSize: 13, color: "#38bdf8", fontWeight: 600, letterSpacing: "0.12em", marginBottom: 8 }}>
          PCCHUB PORTAL
        </p>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>
          Choose your login
        </h2>

        {[
          {
            href: "user/login.php",
            emoji: "👨‍🎓",
            label: "Student Login",
            sub: "Access student portal & activities",
            accent: "#38bdf8",
          },
          {
            href: "admin/login.php",
            emoji: "👨‍💼",
            label: "Staff Login",
            sub: "Manage system and users",
            accent: "#818cf8",
          },
        ].map(({ href, emoji, label, sub, accent }) => (
          <a
            key={label}
            href={href}
            style={{
              display: "flex", alignItems: "center", gap: 16,
              padding: "1rem 1.25rem",
              background: "rgba(255,255,255,0.04)",
              border: `1px solid rgba(255,255,255,0.08)`,
              borderRadius: 12,
              textDecoration: "none",
              color: "inherit",
              marginBottom: 12,
              transition: "all .2s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.08)";
              e.currentTarget.style.borderColor = accent + "55";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
            }}
          >
            <span style={{ fontSize: 28 }}>{emoji}</span>
            <div>
              <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 2, color: accent }}>{label}</p>
              <p style={{ fontSize: 13, color: "#94a3b8" }}>{sub}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

// ── HomePage ────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {/* global keyframes */}
      <style>{`
        @keyframes fadeIn   { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp  { from { opacity:0; transform:translateY(24px) } to { opacity:1; transform:translateY(0) } }
        @keyframes heroIn   { from { opacity:0; transform:translateY(32px) } to { opacity:1; transform:translateY(0) } }
        @keyframes pulse    { 0%,100% { opacity:.6 } 50% { opacity:1 } }
      `}</style>

      <FloatingBg />
      <LoginModal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* vignette overlay */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none",
        background:
          "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 20%, rgba(2,9,23,0.85) 100%)",
      }} />

      {/* main content */}
      <div style={{
        position: "relative", zIndex: 2,
        minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "2rem 1.5rem",
      }}>
        <div style={{ maxWidth: 780, width: "100%", textAlign: "center", animation: "heroIn .9s ease" }}>

          {/* logo + badge */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
            <div style={{
              width: 80, height: 80, borderRadius: 20,
              border: "1.5px solid rgba(56,189,248,0.35)",
              background: "rgba(14,165,233,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 36,
              boxShadow: "0 0 40px rgba(14,165,233,0.2)",
            }}>
              🎓
            </div>
          </div>

          <p style={{
            fontSize: 12, fontWeight: 700, letterSpacing: "0.18em",
            color: "#38bdf8", marginBottom: "0.75rem",
            animation: "pulse 3s ease infinite",
          }}>
            POLITEKNIK SULTAN MIZAN ZAINAL ABIDIN
          </p>

          <h1 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "clamp(2.6rem, 7vw, 4.5rem)",
            fontWeight: 900,
            lineHeight: 1.08,
            marginBottom: "1.25rem",
            background: "linear-gradient(135deg, #f0f9ff 30%, #38bdf8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Welcome to<br />PCC Hub
          </h1>

          <p style={{
            fontSize: "clamp(1rem, 2.5vw, 1.15rem)",
            color: "#94a3b8",
            maxWidth: 560,
            margin: "0 auto 2.5rem",
            lineHeight: 1.7,
          }}>
            Your all-in-one student portal for academic excellence, community connection,
            and seamless campus life.
          </p>

          {/* CTA button */}
          <button
            onClick={() => setModalOpen(true)}
            style={{
              padding: "0.9rem 2.8rem",
              fontSize: 16, fontWeight: 700,
              background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
              border: "none", borderRadius: 50,
              color: "#fff", cursor: "pointer",
              boxShadow: "0 4px 32px rgba(14,165,233,0.35)",
              transition: "transform .15s, box-shadow .15s",
              marginBottom: "4rem",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.04)";
              e.currentTarget.style.boxShadow = "0 6px 48px rgba(14,165,233,0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 32px rgba(14,165,233,0.35)";
            }}
          >
            Get Started →
          </button>

          {/* feature cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 16,
          }}>
            {FEATURES.map(({ icon, title, desc }) => (
              <div
                key={title}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 16,
                  padding: "1.5rem 1.25rem",
                  textAlign: "left",
                  transition: "all .2s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(14,165,233,0.08)";
                  e.currentTarget.style.borderColor = "rgba(56,189,248,0.25)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
                <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{title}</p>
                <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>

          {/* footer note */}
          <p style={{ marginTop: "3rem", fontSize: 12, color: "#334155" }}>
            © 2025 PCC Hub · Politeknik Sultan Mizan Zainal Abidin
          </p>
        </div>
      </div>
    </>
  );
}