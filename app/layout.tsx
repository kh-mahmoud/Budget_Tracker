import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import RootProvider from "@/components/providers/RootProvider";
import { Toaster } from 'sonner';




const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Budget Tracker",
  description: "friendly app efficiently track and manage your income, expenses, and savings, providing real-time financial insights and control",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
        <body className={inter.className}>
          <RootProvider>
            <main className="min-h-screen">
              {children}
            </main>
          </RootProvider>
          <Toaster
            toastOptions={{
              classNames: {
                error: 'bg-background border-border text-muted',
                loading: 'bg-background border-border text-muted-foreground',
              },
            }}
            richColors
            position="bottom-right" />
        </body>
      </html>
    </ClerkProvider>

  );
}
