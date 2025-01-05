'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from "./ui/moving-border";
import { WavyBackground } from './ui/wavy-background';
import axios from 'axios';
import toast from 'react-hot-toast';
import Image from 'next/image';
function HeroSection() {
  const [user, setUser] = useState({
    username: "",
  })

  const getUserDetails = async () => {
    try {
      const res = await axios.get('/api/users/me');
      setUser({
        username: res.data.data.username,
      });
    } catch (error: any) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    getUserDetails();
  })
  return (
    // <WavyBackground waveWidth={80} className="flex flex-col items-center justify-center  font-[Gilroy] min-h-screen w-screen antialiased relative overflow-hidden px-4">
    <div className='flex flex-col items-center justify-center  font-[Gilroy] min-h-screen w-screen antialiased relative overflow-hidden px-4'>
    <Image src="/herobg.jpg" width={400} height={400} alt="Hero Background" className="absolute w-full h-full object-cover" />
    <div className='z-999 opacity-0 md:opacity-100 absolute bottom-[36vw] md:right-24 md:top-6'>
      <Link href="/login">
        <Button className="rounded-full text-black text-sm md:text-lg bg-gray-300/[0.6] border-gray-400 border dark:border-slate-200">
          {user.username ? user.username : 'Login'}
        </Button>
      </Link>
    </div>
  {/* <Spotlight className="absolute -top-40 left-0 md:left-60 md:-top-20" fill="white" /> */}
  <div className="flex flex-col justify-center items-center p-4 z-10 w-full md:pt-0 text-center -mt-20 md:mt-10">
    <h1 className="text-4xl text-slate-800 md:text-7xl font-bold bg-clip-text dark:text-white mt-7 md:mt-15 bg-opacity-50">
      Buy & Sell Books @ 50%.
    </h1>
    <p className="leading-6 mt-10 text-gray-700 p-2 md:px-4 font-normal text-[15px] md:text-2xl dark:text-white max-w-lg mx-auto">
    Your Gateway to Affordable Learning <br/> Find Second-Hand Books at 50% Price <br/> Directly from Fellow Students😊
    </p>
  </div>
  <div className="flex flex-col md:flex-row items-center justify-center mt-10 gap-4">
    <Link href="/buy">
      <Button className="rounded-2xl text-black bg-blue-300/[0.6] border-gray-400 px-2 md:px-3 py-3 text-base md:text-lg border dark:border-slate-800">
        Buy
      </Button>
      </Link>
      <Link href="/sell">
      <Button className="rounded-2xl text-black bg-blue-300/[0.6] border-gray-400 px-4 md:px-3 py-3 text-base md:text-lg border dark:border-slate-800">
        Sell
      </Button>
    </Link>
  </div>
  </div>
// </WavyBackground>
  )
}

export default HeroSection