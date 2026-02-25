import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#0a0a0f", position: "relative", overflow: "hidden"
    }}>
      <div style={{
        position: "absolute", width: "500px", height: "500px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(108,99,255,0.15) 0%, transparent 70%)",
        top: "-100px", right: "-100px", animation: "float1 8s ease-in-out infinite"
      }} />
      <div style={{
        position: "absolute", width: "400px", height: "400px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(34,211,160,0.08) 0%, transparent 70%)",
        bottom: "-80px", left: "-80px", animation: "float2 10s ease-in-out infinite"
      }} />

      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
        maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)"
      }} />

      <div style={{
        position: "absolute", top: "32px", left: "50%", transform: "translateX(-50%)",
        display: "flex", alignItems: "center", gap: "10px"
      }}>
        <div style={{
          width: "32px", height: "32px", borderRadius: "10px", background: "#6c63ff",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px"
        }}>⚡</div>
        <span style={{
          fontFamily: "'Syne', sans-serif", fontWeight: 800,
          fontSize: "18px", color: "#f0f0ff", letterSpacing: "-0.3px"
        }}>TarsChat</span>
      </div>

      <div style={{ position: "relative", zIndex: 10 }}>
        <SignUp />
      </div>

      <p style={{
        position: "absolute", bottom: "24px", left: "50%", transform: "translateX(-50%)",
        fontSize: "12px", color: "#55556a", whiteSpace: "nowrap",
        fontFamily: "'DM Sans', sans-serif"
      }}>
        ⚡ Real-time messaging · 🔒 End-to-end private · 🌐 Any device
      </p>

      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-40px, 20px) scale(1.08); }
          66% { transform: translate(20px, -30px) scale(0.92); }
        }
      `}</style>
    </div>
  );
}