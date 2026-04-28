import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";

export default function StudentLoginPage() {
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
      const res = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Invalid email or password.");
      } else {
        window.location.href = "/student/dashboard";
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
        .sl-card { animation: fadeInUp .7s ease both; }
        .sl-input { transition: border-color .2s, box-shadow .2s; }
        .sl-input:focus { border-color: #22d3ee !important; box-shadow: 0 0 0 3px rgba(34,211,238,.15); outline: none; }
        .sl-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(34,211,238,.35) !important; }
        .sl-back:hover { background: rgba(255,255,255,.1) !important; transform: translateX(-3px); }
        .sl-error { animation: shake .3s ease; }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "#020917",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1.5rem",
        fontFamily: "'Space Grotesk', sans-serif",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position:"absolute", width:500, height:500, borderRadius:"50%", background:"rgba(34,211,238,.06)", top:-80, right:-120, filter:"blur(90px)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", width:400, height:400, borderRadius:"50%", background:"rgba(16,185,129,.05)", bottom:-60, left:-80, filter:"blur(80px)", pointerEvents:"none" }} />

        <div className="sl-card" style={{
          display: "flex",
          width: "min(100%, 860px)",
          minHeight: 520,
          borderRadius: 20,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 24px 80px rgba(0,0,0,.5)",
        }}>

          {/* LEFT */}
          <div style={{
            flex: 1,
            background: "linear-gradient(160deg, #061a1a 0%, #041212 60%, #020a0a 100%)",
            borderRight: "1px solid rgba(255,255,255,0.06)",
            padding: "3rem 2.5rem",
            display: "flex", flexDirection: "column", justifyContent: "space-between",
          }}>
            <div>
              <div style={{
                width: 56, height: 56, borderRadius: 14,
                background: "rgba(34,211,238,.1)",
                border: "1px solid rgba(34,211,238,.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24, marginBottom: "2rem",
              }}>👨‍🎓</div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", color: "#22d3ee", marginBottom: 8 }}>
                PCCHUB PORTAL
              </p>
              <h2 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                fontWeight: 900, color: "#f0f9ff", lineHeight: 1.15, marginBottom: "1rem",
              }}>
                Student<br />Portal
              </h2>
              <p style={{ fontSize: 14, color: "#164e63", lineHeight: 1.7, maxWidth: 240 }}>
                Access your academic records, activities, merit points, and connect with your campus community.
              </p>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {[
                { icon: "📊", label: "Merit Points",    sub: "Track your achievements" },
                { icon: "🏃", label: "Activities",      sub: "Join runs & events" },
                { icon: "📋", label: "Programs",        sub: "Enroll and submit results" },
              ].map(({ icon, label, sub }) => (
                <div key={label} style={{
                  display:"flex", alignItems:"center", gap:12,
                  padding:"0.65rem 0.9rem",
                  background:"rgba(255,255,255,.03)",
                  border:"1px solid rgba(255,255,255,.06)",
                  borderRadius:10,
                }}>
                  <span style={{ fontSize:18 }}>{icon}</span>
                  <div>
                    <p style={{ fontSize:12, fontWeight:600, color:"#a5f3fc", marginBottom:1 }}>{label}</p>
                    <p style={{ fontSize:11, color:"#164e63" }}>{sub}</p>
                  </div>
                </div>
              ))}

              <button onClick={() => navigate("/")} className="sl-back" style={{
                display:"flex", alignItems:"center", gap:8,
                marginTop:4, padding:"0.6rem 1rem",
                background:"rgba(255,255,255,.05)",
                border:"1px solid rgba(255,255,255,.08)",
                borderRadius:10, color:"#64748b",
                fontSize:13, cursor:"pointer",
                transition:"all .2s", width:"fit-content",
              }}>
                <ArrowLeft size={14} /> Back to Home
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div style={{
            flex: 1,
            background: "#060d12",
            padding: "3rem 2.5rem",
            display: "flex", flexDirection: "column", justifyContent: "center",
          }}>
            <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.14em", color:"#22d3ee", marginBottom:6 }}>
              STUDENT LOGIN
            </p>
            <h3 style={{
              fontFamily:"'Outfit', sans-serif",
              fontSize:26, fontWeight:800, color:"#f0f9ff", marginBottom:6,
            }}>
              Welcome back
            </h3>
            <p style={{ fontSize:13, color:"#164e63", marginBottom:"2rem" }}>
              Use your student credentials to sign in
            </p>

            {error && (
              <div className="sl-error" style={{
                padding:"0.75rem 1rem",
                background:"rgba(239,68,68,.1)",
                border:"1px solid rgba(239,68,68,.2)",
                borderRadius:10, color:"#fca5a5",
                fontSize:13, marginBottom:"1.25rem",
              }}>
                ⚠ {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom:"1.25rem" }}>
                <label style={{ fontSize:12, fontWeight:600, color:"#164e63", display:"block", marginBottom:6, letterSpacing:"0.06em" }}>
                  EMAIL ADDRESS
                </label>
                <div style={{ position:"relative" }}>
                  <Mail size={15} style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"#164e63", pointerEvents:"none" }} />
                  <input
                    className="sl-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@pcchub.my"
                    style={{
                      width:"100%", padding:"0.8rem 0.9rem 0.8rem 2.5rem",
                      background:"rgba(255,255,255,.04)",
                      border:"1px solid rgba(255,255,255,.08)",
                      borderRadius:10, color:"#f0f9ff",
                      fontSize:14, fontFamily:"inherit",
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom:"0.75rem" }}>
                <label style={{ fontSize:12, fontWeight:600, color:"#164e63", display:"block", marginBottom:6, letterSpacing:"0.06em" }}>
                  PASSWORD
                </label>
                <div style={{ position:"relative" }}>
                  <Lock size={15} style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"#164e63", pointerEvents:"none" }} />
                  <input
                    className="sl-input"
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{
                      width:"100%", padding:"0.8rem 2.8rem 0.8rem 2.5rem",
                      background:"rgba(255,255,255,.04)",
                      border:"1px solid rgba(255,255,255,.08)",
                      borderRadius:10, color:"#f0f9ff",
                      fontSize:14, fontFamily:"inherit",
                    }}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{
                    position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
                    background:"none", border:"none", color:"#164e63", cursor:"pointer", padding:0,
                  }}>
                    {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
              </div>

              <div style={{ textAlign:"right", marginBottom:"1.75rem" }}>
                <a href="/forgot-password" style={{ fontSize:12, color:"#22d3ee", textDecoration:"none" }}>
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width:"100%", padding:"0.9rem",
                  background: loading ? "rgba(34,211,238,.3)" : "linear-gradient(135deg, #06b6d4, #0891b2)",
                  border:"none", borderRadius:12,
                  color:"#fff", fontSize:15, fontWeight:700,
                  fontFamily:"inherit", cursor: loading ? "not-allowed" : "pointer",
                  boxShadow:"0 4px 24px rgba(34,211,238,.25)",
                  transition:"transform .15s, box-shadow .15s",
                  marginBottom:"1.5rem",
                }}
              >
                {loading ? "Signing in..." : "Sign In →"}
              </button>

              <p style={{ textAlign:"center", fontSize:13, color:"#1e3a4a" }}>
                Staff or admin?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/admin/login")}
                  style={{ background:"none", border:"none", color:"#22d3ee", fontWeight:700, cursor:"pointer", fontSize:13 }}
                >
                  Sign in here
                </button>
              </p>
            </form>
          </div>

        </div>
      </div>
    </>
  );
}