'use client'
import React from 'react'
import Link from 'next/link'
import { Spotlight } from "./ui/Spotlight";
import { Button } from "./ui/moving-border";

function HeroSection() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-black/[0.96] antialiased relative overflow-hidden px-4">
  <Spotlight className="absolute -top-40 left-0 md:left-60 md:-top-20" fill="white" />
  
  <div className="p-4 max-w-4xl mx-auto absolute z-10 w-full top-40 md:pt-0 text-center">
    <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
      Buy & Sell <br /> Books @ 50%.
    </h1>
    <p className="leading-6 mt-4 px-2 md:px-4 font-normal text-sm md:text-base text-neutral-300 max-w-lg mx-auto">
      Spotlight effect is a great way to draw attention to a specific part of the page...
    </p>
  </div>
  <div className="flex items-center justify-center mt-80">
    <Link href="/books">
      <Button className="rounded-xl px-4 md:px-6 py-3 text-sm md:text-base border border-neutral-200 dark:border-slate-800">
        Explore
      </Button>
    </Link>
  </div>
</div>

  )
}

export default HeroSection