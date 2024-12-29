'use client'
import React, { useState, useEffect } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "@/components/ui/navbar-menu";
import { cn } from "@/utils/cn";
import Link from "next/link";
import { Menu as MenuIcon, X } from "lucide-react"; // Import icons
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "./ui/button";
import {useRouter} from "next/navigation";

function Navbar({ className }: { className?: string }) {
    const [active, setActive] = useState<string | null>(null);
    const [visible, setVisible] = useState(true);
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const router = useRouter();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleScroll = () => {
    const currentScrollPos = window.scrollY;
  
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
  
      setPrevScrollPos(currentScrollPos);
    };
    const getUserDetails = async () => {
      try {
        const res = await axios.get('/api/users/me');
        setUser(res.data.data);
      } catch (error: any) {
        console.log(error.message);
        toast.error(error.message);
      }
    };

    const handleLogin = async () => {
      try {
        if (user) {
          setIsMenuOpen(false)
          await axios.get('/api/users/logout');
          setUser(null);
          toast.success('Logged out successfully');
          router.push("/login");
        } else {
          window.location.href = '/login';
        }
      } catch (error: any) {
        console.log(error.message);
        toast.error(error.message);
      }
    };

    useEffect(() => {
      window.addEventListener('scroll', handleScroll);
      const currentPath = window.location.pathname;
      if (!['/signup', '/login', '/verifyEmail'].includes(currentPath)) {
        getUserDetails();
      }
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, [handleScroll, prevScrollPos]);

    return (
      <div>
      
      <div
        className={cn(`fixed top-4 inset-x-0 md:w-fit mx-auto max-sm:mx-5 z-50 transition-all duration-300 ${
          !visible ? '-translate-y-[150%]' : 'translate-y-0'
        }`, className)}
      >
        <div className="flex flex-col">
        <div className="bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 border border-gray-400 flex justify-between bg-blue-950/[0.9] rounded-3xl md:hidden px-3 py-1 top-3 md:top-8 z-50">
        <h1 className={`text-white top-2 p-2 text-lg md:text-xl font-bold`}>Campus Book</h1>
        
        <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="top-2 right-2 p-2 rounded-lg z-50"
          >
            {isMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
        </button>
        </div>
        <div className="hidden md:block">
        <Menu setActive={setActive}>
        <Link href="/">
                <MenuItem setActive={setActive} active={active} item="Campus Book" className="font-bold -inset-0 text-xl font-[gilroy]"></MenuItem>
            </Link>
            <Link href="/">
                <MenuItem setActive={setActive} active={active} item="Home"></MenuItem>
            </Link>
            <Link href="/profile">
            <MenuItem setActive={setActive} active={active} item="Profile"></MenuItem>
            </Link>
            {/* <MenuItem setActive={setActive} active={active} item="Books">
            <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/fe">First Year</HoveredLink>
            <HoveredLink href="/se">Second Year</HoveredLink>
            <HoveredLink href="/te">Third Year</HoveredLink>
            <HoveredLink href="/be">Final Year</HoveredLink>
          </div>
            </MenuItem> */}
            <Link href="/buy">
            <MenuItem setActive={setActive} active={active} item="Buy"></MenuItem>
            </Link>
            <Link href="/sell">
            <MenuItem setActive={setActive} active={active} item="Sell"></MenuItem>
            </Link>
            <Link href="/onechat">
            <MenuItem setActive={setActive} active={active} item="Chats"></MenuItem>
            </Link>
            <Link href="/mybooks">
            <MenuItem setActive={setActive} active={active} item="My Books"></MenuItem>
            </Link>
        </Menu>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden space-y-5 font-semibold bg-gray-600 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 border border-gray-400 fixed rounded-3xl top-14 py-1 w-full bg-blue-950/[0.9] transition-opacity duration-300 transform ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>         
            <div className="flex flex-col px-4">

              <Link 
                href="/" 
                className="text-md px-4 py-1 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/profile" 
                className="text-md px-4 py-1 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
        
              <Link 
                href="/buy" 
                className="text-md px-4 py-1 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Buy
              </Link>
              <Link 
                href="/sell" 
                className="text-md px-4 py-1 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Sell
              </Link>
              <Link 
                href="/onechat" 
                className="text-md px-4 py-1 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Chats
              </Link>
              <Link 
                href="/mybooks" 
                className="text-md px-4 py-1 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                My Books
              </Link>
              <Button 
                className="text-md px-2 py-1 rounded-3xl"
                onClick={() => handleLogin()}
              >
                {user ? 'Logout' : 'Login'}
              </Button>
            </div>
          </div>
          {/* <div className={`md:hidden absolute rounded-3xl w-full border-[2px] border-gray-400 px-4 py-6 bg-transparent  transition-transform duration-300 transform ${isMenuOpen ? 'translate-y-40' : 'translate-y-0'}`}></div>         */}
          </div>
        </div>

        </div>
  )
}

export default Navbar