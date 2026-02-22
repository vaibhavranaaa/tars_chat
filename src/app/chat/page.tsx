import { currentUser } from "@clerk/nextjs/server";

export default async function ChatPage() {
  const user = await currentUser();

  return (
    <div
      className="flex-1 flex items-center justify-center h-full relative overflow-hidden"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl animate-pulse"
          style={{ background: "radial-gradient(circle, #7c6aff, transparent)", top: "-5%", left: "15%", animationDuration: "4s" }} />
        <div className="absolute w-80 h-80 rounded-full opacity-15 blur-3xl animate-pulse"
          style={{ background: "radial-gradient(circle, #a78bfa, transparent)", bottom: "-5%", right: "15%", animationDuration: "6s", animationDelay: "2s" }} />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }} />

      <style>{`
        @keyframes floatA {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50%       { transform: translateY(-14px) rotate(1deg); }
        }
        @keyframes floatB {
          0%, 100% { transform: translateY(0px) rotate(1deg); }
          50%       { transform: translateY(-18px) rotate(-1deg); }
        }
        @keyframes floatC {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.4); }
        }
        .anim-1 { animation: fadeSlideUp 0.7s ease 0s both; }
        .anim-2 { animation: fadeSlideUp 0.7s ease 0.15s both; }
        .anim-3 { animation: fadeSlideUp 0.7s ease 0.3s both; }
        .anim-4 { animation: fadeSlideUp 0.7s ease 0.45s both; }
        .anim-5 { animation: fadeSlideUp 0.7s ease 0.6s both; }
        .gradient-name {
          background: linear-gradient(270deg, #7c6aff, #a78bfa, #c4b5fd, #7c6aff);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientShift 4s ease infinite;
        }
        .float-a { animation: floatA 3.5s ease-in-out infinite; }
        .float-b { animation: floatB 4.5s ease-in-out infinite; }
        .float-c { animation: floatC 5s ease-in-out infinite; }
        .float-d { animation: floatA 4s ease-in-out infinite 1s; }
        .pulse-dot { animation: pulse-dot 2s ease-in-out infinite; }
      `}</style>

      {/* TOP LEFT card */}
      <div className="absolute float-a" style={{ top: "15%", left: "5%" }}>
        <div className="px-4 py-3 rounded-2xl flex items-center gap-3"
          style={{
            background: "rgba(22,22,30,0.9)",
            border: "1px solid rgba(249,115,22,0.4)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 8px 32px rgba(249,115,22,0.15)",
            minWidth: "160px",
          }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #f97316, #fb923c)" }}>⚡</div>
          <div>
            <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Real-time</p>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Instant delivery</p>
          </div>
        </div>
      </div>

      {/* TOP RIGHT card */}
      <div className="absolute float-b" style={{ top: "15%", right: "5%" }}>
        <div className="px-4 py-3 rounded-2xl flex items-center gap-3"
          style={{
            background: "rgba(22,22,30,0.9)",
            border: "1px solid rgba(16,185,129,0.4)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 8px 32px rgba(16,185,129,0.15)",
            minWidth: "160px",
          }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #10b981, #34d399)" }}>🔒</div>
          <div>
            <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Private</p>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>End-to-end secure</p>
          </div>
        </div>
      </div>

      {/* BOTTOM LEFT card */}
      <div className="absolute float-c" style={{ bottom: "18%", left: "5%" }}>
        <div className="px-4 py-3 rounded-2xl flex items-center gap-3"
          style={{
            background: "rgba(22,22,30,0.9)",
            border: "1px solid rgba(59,130,246,0.4)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 8px 32px rgba(59,130,246,0.15)",
            minWidth: "160px",
          }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #3b82f6, #60a5fa)" }}>🌐</div>
          <div>
            <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Any Device</p>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Always in sync</p>
          </div>
        </div>
      </div>

      {/* BOTTOM RIGHT card */}
      <div className="absolute float-d" style={{ bottom: "18%", right: "5%" }}>
        <div className="px-4 py-3 rounded-2xl flex items-center gap-3"
          style={{
            background: "rgba(22,22,30,0.9)",
            border: "1px solid rgba(124,106,255,0.4)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 8px 32px rgba(124,106,255,0.2)",
            minWidth: "160px",
          }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #7c6aff, #a78bfa)" }}>💬</div>
          <div>
            <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Live Chat</p>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Messages in ms</p>
          </div>
        </div>
      </div>

      {/* Center content */}
      <div className="relative z-10 text-center px-4" style={{ maxWidth: "480px", width: "100%" }}>

        {/* Icon */}
        <div className="anim-1 relative inline-flex items-center justify-center mb-6">
          <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl"
            style={{
              background: "linear-gradient(135deg, #7c6aff, #a78bfa)",
              boxShadow: "0 0 80px rgba(124,106,255,0.6), 0 0 160px rgba(124,106,255,0.2)",
            }}>
            💬
          </div>
          <div className="absolute inset-0 rounded-3xl animate-ping opacity-20"
            style={{ background: "var(--accent)" }} />
        </div>

        {/* Heading */}
        <h1 className="anim-2 text-4xl font-bold mb-3 tracking-tight"
          style={{ color: "var(--text-primary)" }}>
          Welcome back,{" "}
          <span className="gradient-name">{user?.firstName ?? "there"}!</span>
        </h1>

        <p className="anim-3 text-sm mb-6 leading-relaxed"
          style={{ color: "var(--text-secondary)" }}>
          Your conversations are waiting. Search for someone or pick up where you left off.
        </p>

        {/* Stats row */}
        <div className="anim-4 grid grid-cols-3 gap-3 mb-6">
          {[
            { value: "< 100ms", label: "Latency" },
            { value: "256-bit", label: "Encryption" },
            { value: "99.9%", label: "Uptime" },
          ].map(({ value, label }) => (
            <div key={label} className="rounded-2xl py-3 px-2"
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border)",
              }}>
              <p className="text-base font-bold" style={{ color: "var(--accent)" }}>{value}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Live indicator */}
        <div className="anim-4 flex items-center justify-center gap-2 mb-5">
          <span className="pulse-dot w-2 h-2 rounded-full inline-block"
            style={{ background: "var(--online)" }} />
          <span className="text-xs font-medium" style={{ color: "var(--online)" }}>
            Powered by Convex — updates in real time
          </span>
        </div>

        {/* Tip */}
        <div className="anim-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm"
          style={{
            background: "var(--accent-soft)",
            border: "1px solid rgba(124,106,255,0.25)",
            color: "var(--accent)",
          }}>
          💡 Click <strong className="mx-1">Search</strong> in the sidebar to start a new chat
        </div>
      </div>
    </div>
  );
}