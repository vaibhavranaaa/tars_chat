"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { useEffect } from "react";

export default function UserSyncProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const upsertUser = useMutation(api.users.upsertUser);
  const setOnlineStatus = useMutation(api.users.setOnlineStatus);

  useEffect(() => {
    if (!isLoaded || !user) return;

    upsertUser({
      clerkId: user.id,
      name: user.fullName ?? user.username ?? "Anonymous",
      email: user.emailAddresses[0]?.emailAddress ?? "",
      imageUrl: user.imageUrl,
    });

    setOnlineStatus({ isOnline: true });

    const handleOffline = () => setOnlineStatus({ isOnline: false });
    window.addEventListener("beforeunload", handleOffline);
    return () => window.removeEventListener("beforeunload", handleOffline);
  }, [isLoaded, user]);

  return <>{children}</>;
}