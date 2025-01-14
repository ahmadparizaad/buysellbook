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
      {process.env.NODE_ENV === "production" && (
      <head>
          <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9538009046837010"
          crossOrigin="anonymous"></script>
      </head>
                )}

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
