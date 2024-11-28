'use client'
import React from 'react'
import Link from 'next/link'
import { Spotlight } from "./ui/Spotlight";
import { Button } from "./ui/moving-border";
import { WavyBackground } from './ui/wavy-background';

function HeroSection() {
  return (
    <WavyBackground waveWidth={80} className="flex flex-col items-center justify-center min-h-screen w-screen antialiased relative overflow-hidden px-4">
  {/* <Spotlight className="absolute -top-40 left-0 md:left-60 md:-top-20" fill="white" /> */}
  <div className="flex flex-col justify-center items-center p-4 z-10 w-full md:pt-0 text-center mt-10">
    <h1 className="text-4xl md:text-7xl font-bold bg-clip-text text-white md:mt-20 bg-opacity-50">
      Buy & Sell Books @ 50%.
    </h1>
    <p className="leading-6 mt-4 p-2 md:px-4 font-normal text-md md:text-lg text-white max-w-lg mx-auto">
    Your Gateway to Affordable Learning - Find Second-Hand Books at 50% Price, Directly from Fellow Students!
    </p>
  </div>
  <div className="flex items-center justify-center mt-10">
    <Link href="/books">
      <Button className="rounded-xl px-4 md:px-6 py-3 text-sm md:text-base border border-neutral-200 dark:border-slate-800">
        Explore
      </Button>
    </Link>
  </div>
</WavyBackground>

  )
}

export default HeroSection