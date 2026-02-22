import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/sidebar/Sidebar";
import UserSyncProvider from "@/components/providers/UserSyncProvider";

export default async function ChatLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  return (
    <UserSyncProvider>
      <div className="flex h-screen w-full overflow-hidden bg-white">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {children}
        </main>
      </div>
    </UserSyncProvider>
  );
}