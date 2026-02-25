"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

interface Props {
  onSelectUser: (userId: Id<"users">) => void;
}

export default function UserSearch({ onSelectUser }: Props) {
  const [search, setSearch] = useState("");
  const users = useQuery(api.users.getAllUsers, { search });

  return (
    <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
      {/* Search input */}
      <div style={{ position: "relative" }}>
        <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "14px" }}>🔍</span>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: "100%", padding: "10px 12px 10px 36px", borderRadius: "12px",
            background: "#1a1a24", border: "1px solid rgba(255,255,255,0.07)",
            color: "#f0f0ff", fontSize: "13px", outline: "none",
            fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box"
          }}
          onFocus={e => (e.target.style.borderColor = "#6c63ff")}
          onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.07)")}
        />
      </div>

      {/* Loading */}
      {users === undefined && (
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", borderRadius: "10px", background: "#1a1a24" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#222230", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ height: "12px", borderRadius: "6px", background: "#222230", width: "60%", marginBottom: "6px" }} />
                <div style={{ height: "10px", borderRadius: "6px", background: "#222230", width: "40%" }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {users?.length === 0 && (
        <div style={{ textAlign: "center", padding: "24px 0" }}>
          <p style={{ fontSize: "24px", marginBottom: "8px" }}>🔍</p>
          <p style={{ fontSize: "13px", color: "#55556a" }}>No users found</p>
        </div>
      )}

      {/* Users list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        {users?.map(user => {
          const initials = user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
          return (
            <button
              key={user._id}
              onClick={() => onSelectUser(user._id)}
              style={{
                display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px",
                borderRadius: "12px", background: "transparent", border: "1px solid transparent",
                cursor: "pointer", textAlign: "left", width: "100%", transition: "all 0.15s"
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = "#1a1a24";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
                (e.currentTarget as HTMLElement).style.borderColor = "transparent";
              }}
            >
              <div style={{ position: "relative", flexShrink: 0 }}>
                {user.imageUrl ? (
                  <img src={user.imageUrl} alt={user.name} style={{ width: "38px", height: "38px", borderRadius: "50%", objectFit: "cover" }} />
                ) : (
                  <div style={{
                    width: "38px", height: "38px", borderRadius: "50%", background: "#6c63ff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "13px", fontWeight: 700, color: "white", fontFamily: "'Syne', sans-serif"
                  }}>{initials}</div>
                )}
                <span style={{
                  position: "absolute", bottom: 0, right: 0, width: "10px", height: "10px",
                  borderRadius: "50%", background: user.isOnline ? "#22d3a0" : "#55556a",
                  border: "2px solid #111118"
                }} />
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#f0f0ff", margin: 0, fontFamily: "'Syne', sans-serif" }}>{user.name}</p>
                <p style={{ fontSize: "11px", color: user.isOnline ? "#22d3a0" : "#55556a", margin: "2px 0 0" }}>
                  {user.isOnline ? "● Online" : "○ Offline"}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}