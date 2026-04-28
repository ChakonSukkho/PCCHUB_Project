import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Phone, BadgeCheck, ArrowLeft } from "lucide-react";

function StrengthBar({ password }) {
  const checks = {
    length: password.length >= 6,
    upper:  /[A-Z]/.test(password),
    lower:  /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };
  const score = Object.values(checks).filter(Boolean).length;
  const label = score <= 1 ? "Weak" : score <= 3 ? "Medium" : "Strong";
  const colors = { Weak: "#ef4444", Medium: "#f59e0b", Strong: "#22c55e" };
  const widths  = { Weak: "33%", Medium: "66%", Strong: "100%" };

  if (!password) return null;
  return (
    <div style={{ marginTop:8 }}>
      <div style={{ height:4, background:"rgba(255,255,255,.08)", borderRadius:4 }}>
        <div style={{ height:"100%", borderRadius:4, width:widths[label], background:colors[label], transition:"all .3s" }} />
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:6, flexWrap:"wrap", gap:4 }}>
        {[
          { key:"length", text:"6+ chars" },
          { key:"upper",  text:"Uppercase" },
          { key:"lower",  text:"Lowercase" },
          { key:"number", text:"Number" },
        ].map(({ key, text }) => (
          <span key={key} style={{
            fontSize:10, fontWeight:600, letterSpacing:"0.04em",
            color: checks[key] ? "#22c55e" : "#334155",
          }}>
            {checks[key] ? "✓" : "○"} {text}
          </span>
        ))}
      </div>
    </div>
  );
}

function Field({ label, icon: Icon, error, children }) {
  return (
    <div style={{ marginBottom:"1.1rem" }}>
      <label style={{ fontSize:11, fontWeight:700, letterSpacing:"0.08em", color: error ? "#f87171" : "#334155", display:"block", marginBottom:5 }}>
        {label}
      </label>
      <div style={{ position:"relative" }}>
        {Icon && <Icon size={14} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"#334155", pointerEvents:"none" }} />}
        {children}
      </div>
      {error && <p style={{ fontSize:11, color:"#f87171", marginTop:4 }}>{error}</p>}
    </div>
  );
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm]     = useState({ full_name:"", email:"", staff_id:"", phone:"", password:"", confirm_password:"" });
  const [showPass, setShowPass]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverMsg, setServerMsg] = useState({ type:"", text:"" });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  function validate() {
    const e = {};
    if (form.full_name.trim().length < 3)        e.full_name = "Min 3 characters.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email format.";
    if (form.staff_id.trim() === "")             e.staff_id = "Staff ID is required.";
    if (!/^01\d{8,9}$/.test(form.phone))        e.phone = "e.g. 0123456789";
    if (form.password.length < 6 ||
        !/[A-Z]/.test(form.password) ||
        !/[a-z]/.test(form.password) ||
        !/[0-9]/.test(form.password))            e.password = "Must have uppercase, lowercase, number, 6+ chars.";
    if (form.confirm_password !== form.password) e.confirm_password = "Passwords do not match.";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerMsg({ type:"", text:"" });
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerMsg({ type:"error", text: data.message || "Registration failed." });
      } else {
        setServerMsg({ type:"success", text:"Registration submitted! Pending admin approval." });
        setTimeout(() => navigate("/admin/login"), 2500);
      }
    } catch {
      setServerMsg({ type:"error", text:"Server error. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = (field) => ({
    width:"100%",
    padding: field === "password" || field === "confirm_password"
      ? "0.75rem 2.8rem 0.75rem 2.5rem"
      : "0.75rem 0.9rem 0.75rem 2.5rem",
    background: errors[field] ? "rgba(239,68,68,.06)" : "rgba(255,255,255,.04)",
    border: `1px solid ${errors[field] ? "rgba(239,68,68,.4)" : "rgba(255,255,255,.08)"}`,
    borderRadius:10, color:"#f0f9ff",
    fontSize:14, fontFamily:"inherit",
    outline:"none", transition:"border-color .2s, box-shadow .2s",
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&family=Space+Grotesk:wght@400;500;700&display=swap');
        @keyframes fadeInUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        .rg-card { animation: fadeInUp .7s ease both; }
        .rg-input:focus { border-color: rgba(99,102,241,.6) !important; box-shadow: 0 0 0 3px rgba(99,102,241,.12) !important; }
        .rg-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 32px rgba(99,102,241,.4) !important; }
        .rg-back:hover { background:rgba(255,255,255,.1) !important; transform:translateX(-3px); }
      `}</style>

      <div style={{
        minHeight:"100vh",
        background:"#020917",
        display:"flex", alignItems:"center", justifyContent:"center",
        padding:"1.5rem",
        fontFamily:"'Space Grotesk', sans-serif",
        position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", width:500, height:500, borderRadius:"50%", background:"rgba(99,102,241,.06)", top:-100, right:-80, filter:"blur(80px)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", width:350, height:350, borderRadius:"50%", background:"rgba(14,165,233,.05)", bottom:-60, left:-60, filter:"blur(70px)", pointerEvents:"none" }} />

        <div className="rg-card" style={{
          display:"flex",
          width:"min(100%, 900px)",
          borderRadius:20, overflow:"hidden",
          border:"1px solid rgba(255,255,255,0.07)",
          boxShadow:"0 24px 80px rgba(0,0,0,.5)",
        }}>

          {/* LEFT */}
          <div style={{
            width:280, flexShrink:0,
            background:"linear-gradient(160deg, #0d0f2b 0%, #080a1f 100%)",
            borderRight:"1px solid rgba(255,255,255,.06)",
            padding:"3rem 2rem",
            display:"flex", flexDirection:"column", justifyContent:"space-between",
          }}>
            <div>
              <div style={{
                width:52, height:52, borderRadius:13,
                background:"rgba(99,102,241,.12)",
                border:"1px solid rgba(99,102,241,.25)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:22, marginBottom:"2rem",
              }}>📝</div>
              <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.16em", color:"#818cf8", marginBottom:8 }}>
                PCCHUB PORTAL
              </p>
              <h2 style={{
                fontFamily:"'Outfit', sans-serif",
                fontSize:"1.8rem", fontWeight:900, color:"#f0f9ff",
                lineHeight:1.15, marginBottom:"1rem",
              }}>
                Staff<br/>Registration
              </h2>
              <p style={{ fontSize:13, color:"#2e3460", lineHeight:1.7 }}>
                Submit your details for admin review. You'll be notified once approved.
              </p>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {[
                { icon:"🔒", text:"Secure registration" },
                { icon:"✅", text:"Admin approval required" },
                { icon:"📧", text:"Email notification sent" },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display:"flex", alignItems:"center", gap:10, fontSize:12, color:"#334155" }}>
                  <span style={{ fontSize:16 }}>{icon}</span>{text}
                </div>
              ))}

              <button onClick={() => navigate("/admin/login")} className="rg-back" style={{
                display:"flex", alignItems:"center", gap:8,
                marginTop:8, padding:"0.6rem 1rem",
                background:"rgba(255,255,255,.05)",
                border:"1px solid rgba(255,255,255,.08)",
                borderRadius:10, color:"#475569",
                fontSize:12, cursor:"pointer",
                transition:"all .2s", width:"fit-content",
              }}>
                <ArrowLeft size={13}/> Back to Login
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div style={{
            flex:1,
            background:"#080c1a",
            padding:"2.5rem 2.5rem",
            overflowY:"auto",
          }}>
            <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.14em", color:"#818cf8", marginBottom:6 }}>
              NEW ACCOUNT
            </p>
            <h3 style={{
              fontFamily:"'Outfit', sans-serif",
              fontSize:22, fontWeight:800, color:"#f0f9ff", marginBottom:"1.5rem",
            }}>
              Create staff account
            </h3>

            {serverMsg.text && (
              <div style={{
                padding:"0.75rem 1rem",
                background: serverMsg.type === "success" ? "rgba(34,197,94,.1)" : "rgba(239,68,68,.1)",
                border: `1px solid ${serverMsg.type === "success" ? "rgba(34,197,94,.25)" : "rgba(239,68,68,.25)"}`,
                borderRadius:10,
                color: serverMsg.type === "success" ? "#86efac" : "#fca5a5",
                fontSize:13, marginBottom:"1.25rem",
              }}>
                {serverMsg.type === "success" ? "✓ " : "⚠ "}{serverMsg.text}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 1.5rem" }}>

                <Field label="FULL NAME" icon={User} error={errors.full_name}>
                  <input className="rg-input" style={inputStyle("full_name")}
                    value={form.full_name} onChange={set("full_name")} placeholder="Ahmad bin Ali" />
                </Field>

                <Field label="STAFF ID" icon={BadgeCheck} error={errors.staff_id}>
                  <input className="rg-input" style={inputStyle("staff_id")}
                    value={form.staff_id} onChange={set("staff_id")} placeholder="STF2024001"
                    onBlur={(e) => setForm(f => ({ ...f, staff_id: e.target.value.toUpperCase() }))} />
                </Field>

              </div>

              <Field label="OFFICIAL EMAIL" icon={Mail} error={errors.email}>
                <input className="rg-input" style={inputStyle("email")}
                  type="email" value={form.email} onChange={set("email")} placeholder="staff@pcchub.my" />
              </Field>

              <Field label="PHONE NUMBER" icon={Phone} error={errors.phone}>
                <input className="rg-input" style={inputStyle("phone")}
                  value={form.phone}
                  onChange={(e) => setForm(f => ({ ...f, phone: e.target.value.replace(/\D/g,"") }))}
                  placeholder="0123456789" maxLength={11} />
              </Field>

              <Field label="PASSWORD" icon={Lock} error={errors.password}>
                <input className="rg-input" style={inputStyle("password")}
                  type={showPass ? "text" : "password"}
                  value={form.password} onChange={set("password")} placeholder="••••••••" />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                  position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
                  background:"none", border:"none", color:"#334155", cursor:"pointer", padding:0,
                }}>
                  {showPass ? <EyeOff size={15}/> : <Eye size={15}/>}
                </button>
                <StrengthBar password={form.password} />
              </Field>

              <Field label="CONFIRM PASSWORD" icon={Lock} error={errors.confirm_password}>
                <input className="rg-input" style={inputStyle("confirm_password")}
                  type={showConfirm ? "text" : "password"}
                  value={form.confirm_password} onChange={set("confirm_password")} placeholder="••••••••" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{
                  position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
                  background:"none", border:"none", color:"#334155", cursor:"pointer", padding:0,
                }}>
                  {showConfirm ? <EyeOff size={15}/> : <Eye size={15}/>}
                </button>
              </Field>

              <button
                type="submit"
                disabled={loading}
                className="rg-btn"
                style={{
                  width:"100%", padding:"0.9rem", marginTop:"0.5rem",
                  background: loading ? "rgba(99,102,241,.3)" : "linear-gradient(135deg, #6366f1, #4f46e5)",
                  border:"none", borderRadius:12,
                  color:"#fff", fontSize:15, fontWeight:700,
                  fontFamily:"inherit", cursor: loading ? "not-allowed" : "pointer",
                  boxShadow:"0 4px 24px rgba(99,102,241,.3)",
                  transition:"transform .15s, box-shadow .15s",
                  marginBottom:"1.25rem",
                }}
              >
                {loading ? "Submitting..." : "Submit Registration Request →"}
              </button>

              <p style={{ textAlign:"center", fontSize:13, color:"#1e293b" }}>
                Already have an account?{" "}
                <button type="button" onClick={() => navigate("/admin/login")} style={{
                  background:"none", border:"none", color:"#818cf8",
                  fontWeight:700, cursor:"pointer", fontSize:13,
                }}>
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