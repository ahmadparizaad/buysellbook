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
        {process.env.NODE_ENV === "production" && (
          <>
        <script async type='text/javascript' src='//pl25672536.profitablecpmrate.com/92/b6/49/92b6496befa6e7512faa3efd72b8ac84.js'></script>
        <script type="text/javascript">
        atOptions = {`{
          'key' : '0f829db4326cd0b19b77a0058cc26c4d',
          'format' : 'iframe',
          'height' : 300,
          'width' : 160,
          'params' : {}
        }`};
      </script>
      <script async type="text/javascript" src="//www.highperformanceformat.com/0f829db4326cd0b19b77a0058cc26c4d/invoke.js"></script>
      <script type="text/javascript">
      atOptions = {`{
        'key' : '0589a46fadc2635261f5d7864e25bf69',
        'format' : 'iframe',
        'height' : 50,
        'width' : 320,
        'params' : {}
      }`};
    </script>
    <script async type="text/javascript" src="//www.highperformanceformat.com/0589a46fadc2635261f5d7864e25bf69/invoke.js"></script>
        </>
        )}
        </body>
    </html>
  );
}
