'use client';
import React from 'react';
import Link from 'next/link';
import Navbar from "@/components/Navbar";
import { Spotlight } from "@/components/ui/Spotlight";
import { cn } from "@/utils/cn";
import HeroSection from '@/components/HeroSection';
import HowItWorks from '@/components/HowItWorks';
import Footer from '@/components/Footer';
import ContactUs from '@/components/ContactUs';
import SmoothScroll from '../components/ui/smoothScroll';

// import { useEffect, useState } from "react";
// import LoadingBar from "react-top-loading-bar";
// import { useRouter } from "next/compat/router";

export default function Home() {
  // const [progress, setProgress] = useState(0);
  // const router = useRouter();

  // useEffect(() => {

  //   // START VALUE - WHEN LOADING WILL START
  //    router?.events.on("routeChangeStart", () => {
  //         setProgress(40);
  //       });
    
  //   // COMPLETE VALUE - WHEN LOADING IS FINISHED
  //    router?.events.on("routeChangeComplete", () => {
  //         setProgress(100);
  //       });
    
  //   }, [router?.events]);

  return (
    <>
    {/* <LoadingBar 
    color="rgb(180, 130, 251)" 
    progress={progress} 
    waitingTime={400}
    onLoaderFinished={() => {
      setProgress(0);
  }} /> */}
    <SmoothScroll>

    <div  data-scroll-container className='min-h-screen max-w-screen md:w-auto bg-white antialiased bg-grid-white/[0.02]'>    
        <HeroSection/>
        <HowItWorks/>
        <ContactUs/>
    </div>
    </SmoothScroll>

    </>
  )
}

