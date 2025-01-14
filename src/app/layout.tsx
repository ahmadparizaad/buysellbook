import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Suspense } from "react";
import { LoadingProvider } from '@/components/LoadingProvider';
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Campus Book",
  description: "Campus Book: Your gateway to affordable learning. Buy and sell second-hand books directly from fellow students at 50% off.",
  url: "https://campusbook.live",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  

  return (
    <html lang="en" className="overflow-x-hidden font-[Gilroy]">
      <body className={inter.className}>
        <Suspense>
        <LoadingProvider>
        <Navbar />
        
        {children}
        <Analytics />
        <SpeedInsights />

        <Toaster/>
        <Footer/>
        </LoadingProvider>
        </Suspense>
      </body>
    </html>
  );
}
