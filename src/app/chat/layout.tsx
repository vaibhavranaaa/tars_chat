"use client";

import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import Sidebar from "@/components/sidebar/Sidebar";
import { useParams } from "next/navigation";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const setOnlineStatus = useMutation(api.users.setOnlineStatus);
  const params = useParams();
  const conversationId = params?.conversationId as string | undefined;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setOnlineStatus({ isOnline: true });
    const handleBeforeUnload = () => setOnlineStatus({ isOnline: false });
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      setOnlineStatus({ isOnline: false });
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [setOnlineStatus]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const showSidebar = !isMobile || !conversationId;
  const showChat = !isMobile || !!conversationId;

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#0a0a0f" }}>
      {showSidebar && (
        <div style={{
          width: isMobile ? "100%" : "280px",
          minWidth: isMobile ? "100%" : "280px",
          maxWidth: isMobile ? "100%" : "280px",
          flexShrink: 0, height: "100%", overflow: "hidden"
        }}>
          <Sidebar />
        </div>
      )}
      {showChat && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
          {children}
        </div>
      )}
    </div>
  );
}