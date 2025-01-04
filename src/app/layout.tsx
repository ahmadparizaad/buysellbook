'use client';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Spotlight } from "@/components/ui/Spotlight";
import Navbar from "@/components/Navbar";
import LoginPage from "./login/page";
import SignupPage from "./signup/page";
import { useInitializeCometChat } from "@/utils/cometchatConfig";
import { Suspense, useEffect, useState } from "react";
import { LoadingProvider } from '@/components/LoadingProvider';
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useInitializeCometChat();
  
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <html lang="en" className="dark overflow-x-hidden">
      <body className={inter.className}>
        <Suspense>
        <LoadingProvider>
        <Navbar />
        
        {children}
        <Analytics />
        <SpeedInsights />

        <div><Toaster/></div>
        </LoadingProvider>
        </Suspense>
      </body>
    </html>
  );
}
