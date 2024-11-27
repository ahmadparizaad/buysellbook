'use client';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Spotlight } from "@/components/ui/Spotlight";
import Navbar from "@/components/Navbar";
import LoginPage from "./login/page";
import SignupPage from "./signup/page";
import { useInitializeCometChat } from "@/utils/cometchatConfig";
import { useEffect, useState } from "react";

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
        {isClient && <Navbar />}
        <Spotlight
          className="left-40  md:left-60 md:-top-20"
          fill="blue"
        />
        {children}
      </body>
    </html>
  );
}
