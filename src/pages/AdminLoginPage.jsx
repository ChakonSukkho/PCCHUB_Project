import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Invalid email or password.");
      } else {
        // redirect based on role from API response
        if (data.role === "admin") window.location.href = "/admin/dashboard";
        else window.location.href = "/staff/dashboard";
      }
    } catch {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&family=Space+Grotesk:wght@400;500;700&display=swap');
        @keyframes fadeInUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
        .al-card { animation: fadeInUp .7s ease both; }
        .al-input { transition: border-color .2s, box-shadow .2s; }
        .al-input:focus { border-color: #0ea5e9 !important; box-shadow: 0 0 0 3px rgba(14,165,233,.15); outline: none; }
        .al-btn { transition: transform .15s, box-shadow .15s; }
        .al-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(14,165,233,.4) !important; }
        .al-btn:active { transform: translateY(0); }
        .al-back:hover { background: rgba(255,255,255,.12) !important; transform: translateX(-3px); }
        .al-error { animation: shake .3s ease; }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "#020917",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1.5rem",
        fontFamily: "'Space Grotesk', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* bg glow blobs */}
        <div style={{ position:"absolute", width:500, height:500, borderRadius:"50%", background:"rgba(14,165,233,.07)", top:-100, left:-150, filter:"blur(80px)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", width:400, height:400, borderRadius:"50%", background:"rgba(99,102,241,.06)", bottom:-80, right:-100, filter:"blur(80px)", pointerEvents:"none" }} />

        <div className="al-card" style={{
          display: "flex",
          width: "min(100%, 860px)",
          minHeight: 520,
          borderRadius: 20,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 24px 80px rgba(0,0,0,.5)",
        }}>

          {/* ── LEFT PANEL ── */}
          <div style={{
            flex: 1,
            background: "linear-gradient(160deg, #0c1f3a 0%, #0a1628 60%, #060d1a 100%)",
            borderRight: "1px solid rgba(255,255,255,0.06)",
            padding: "3rem 2.5rem",
            display: "flex", flexDirection: "column",
            justifyContent: "space-between",
          }}>
            {/* logo area */}
            <div>
              <div style={{
                width: 56, height: 56, borderRadius: 14,
                background: "rgba(14,165,233,.12)",
                border: "1px solid rgba(14,165,233,.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24, marginBottom: "2rem",
              }}>🎓</div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", color: "#38bdf8", marginBottom: 8 }}>
                PCCHUB PORTAL
              </p>
              <h2 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                fontWeight: 900, color: "#f0f9ff", lineHeight: 1.15, marginBottom: "1rem",
              }}>
                Admin &<br />Staff Access
              </h2>
              <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, maxWidth: 240 }}>
                Sign in to manage the student portal, approve registrations, and monitor campus activities.
              </p>
            </div>

            {/* role badges */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: "👨‍💼", label: "Administrator", sub: "Full system access" },
                { icon: "👩‍🏫", label: "Staff Member",   sub: "Manage students & programs" },
              ].map(({ icon, label, sub }) => (
                <div key={label} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "0.75rem 1rem",
                  background: "rgba(255,255,255,.04)",
                  border: "1px solid rgba(255,255,255,.07)",
                  borderRadius: 12,
                }}>
                  <span style={{ fontSize: 20 }}>{icon}</span>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#cbd5e1", marginBottom: 1 }}>{label}</p>
                    <p style={{ fontSize: 11, color: "#475569" }}>{sub}</p>
                  </div>
                </div>
              ))}

              <button
                onClick={() => navigate("/")}
                className="al-back"
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  marginTop: 4,
                  padding: "0.6rem 1rem",
                  background: "rgba(255,255,255,.06)",
                  border: "1px solid rgba(255,255,255,.1)",
                  borderRadius: 10,
                  color: "#94a3b8", fontSize: 13, cursor: "pointer",
                  transition: "all .2s", width: "fit-content",
                }}
              >
                <ArrowLeft size={14} /> Back to Home
              </button>
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div style={{
            flex: 1,
            background: "#080f1e",
            padding: "3rem 2.5rem",
            display: "flex", flexDirection: "column", justifyContent: "center",
          }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: "#38bdf8", marginBottom: 6 }}>
              SIGN IN
            </p>
            <h3 style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 26, fontWeight: 800, color: "#f0f9ff", marginBottom: 6,
            }}>
              Welcome back
            </h3>
            <p style={{ fontSize: 13, color: "#475569", marginBottom: "2rem" }}>
              Admin & Staff credentials
            </p>

            {/* error */}
            {error && (
              <div className="al-error" style={{
                padding: "0.75rem 1rem",
                background: "rgba(239,68,68,.1)",
                border: "1px solid rgba(239,68,68,.25)",
                borderRadius: 10, color: "#fca5a5",
                fontSize: 13, marginBottom: "1.25rem",
              }}>
                ⚠ {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* email */}
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6, letterSpacing: "0.06em" }}>
                  EMAIL ADDRESS
                </label>
                <div style={{ position: "relative" }}>
                  <Mail size={15} style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"#334155", pointerEvents:"none" }} />
                  <input
                    className="al-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@pcchub.my"
                    style={{
                      width: "100%", padding: "0.8rem 0.9rem 0.8rem 2.5rem",
                      background: "rgba(255,255,255,.04)",
                      border: "1px solid rgba(255,255,255,.1)",
                      borderRadius: 10, color: "#f0f9ff",
                      fontSize: 14, fontFamily: "inherit",
                    }}
                  />
                </div>
              </div>

              {/* password */}
              <div style={{ marginBottom: "0.75rem" }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6, letterSpacing: "0.06em" }}>
                  PASSWORD
                </label>
                <div style={{ position: "relative" }}>
                  <Lock size={15} style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"#334155", pointerEvents:"none" }} />
                  <input
                    className="al-input"
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{
                      width: "100%", padding: "0.8rem 2.8rem 0.8rem 2.5rem",
                      background: "rgba(255,255,255,.04)",
                      border: "1px solid rgba(255,255,255,.1)",
                      borderRadius: 10, color: "#f0f9ff",
                      fontSize: 14, fontFamily: "inherit",
                    }}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{
                    position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
                    background:"none", border:"none", color:"#475569", cursor:"pointer", padding:0,
                  }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* forgot */}
              <div style={{ textAlign:"right", marginBottom:"1.75rem" }}>
                <a href="/admin/forgot-password" style={{ fontSize:12, color:"#38bdf8", textDecoration:"none" }}>
                  Forgot password?
                </a>
              </div>

              {/* submit */}
              <button
                type="submit"
                disabled={loading}
                className="al-btn"
                style={{
                  width: "100%", padding: "0.9rem",
                  background: loading ? "rgba(14,165,233,.4)" : "linear-gradient(135deg, #0ea5e9, #0284c7)",
                  border: "none", borderRadius: 12,
                  color: "#fff", fontSize: 15, fontWeight: 700,
                  fontFamily: "inherit", cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 24px rgba(14,165,233,.3)",
                  marginBottom: "1.5rem",
                }}
              >
                {loading ? "Signing in..." : "Sign In →"}
              </button>

              {/* register link */}
              <p style={{ textAlign:"center", fontSize:13, color:"#334155" }}>
                Need staff access?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  style={{ background:"none", border:"none", color:"#38bdf8", fontWeight:700, cursor:"pointer", fontSize:13 }}
                >
                  Register here
                </button>
              </p>
            </form>
          </div>

        </div>
      </div>
    </>
  );
}