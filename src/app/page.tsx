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

export default function Home() {
  
  return (
    <>
    <div className='min-h-screen max-w-screen md:w-auto bg-black/[0.96] antialiased bg-grid-white/[0.02]'>
    {/* <div className="h-[40rem] w-full rounded-md flex flex-col md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <div className=" p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
          Buy & Sell <br /> Books @ 50%.
        </h1>
        <p className="leading-6 mt-7 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
          Spotlight effect is a great way to draw attention to a specific part
          of the page. Here, we are drawing the attention towards the text
          section of the page. I don&apos;t know why but I&apos;m running out of
          copy.
        </p>
      </div>
      <div className='flex items-center justify-center mt-5'>
      <Link href='books'>
        <Button variant="outline" className='rounded-[2vw] hover:bg-white hover:text-black ease-linear duration-200 px-8 py-5 mt-9 border dark:border-white/[0.3]'>Explore</Button>
      </Link>
    </div>
    </div> */}
    
        <HeroSection/>
        <HowItWorks/>
        <ContactUs/>
        <Footer/>
    </div>
    </>
  )
}

