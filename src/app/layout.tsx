import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "@/components/providers/ConvexClientProvider";
import "./globals.css";

export const metadata = { title: "Tars Chat" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className="min-h-screen bg-[#0B0F1A] text-white antialiased">
          <div className="min-h-screen w-full bg-gradient-to-br from-[#0B0F1A] via-[#0F172A] to-[#020617]">
            <ConvexClientProvider>
              {children}
            </ConvexClientProvider>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}