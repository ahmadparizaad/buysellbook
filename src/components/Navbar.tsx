'use client'
import React, { useState, useEffect } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "@/components/ui/navbar-menu";
import { cn } from "@/utils/cn";
import Link from "next/link";

function Navbar({ className }: { className?: string }) {
    const [active, setActive] = useState<string | null>(null);
    const [visible, setVisible] = useState(true);
    const [prevScrollPos, setPrevScrollPos] = useState(0);

    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
  
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
  
      setPrevScrollPos(currentScrollPos);
    };
  
    useEffect(() => {
      window.addEventListener('scroll', handleScroll);
  
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, [prevScrollPos]);

    return (
      <div
        className={cn(`fixed top-8 inset-x-0 max-w-2xl mx-auto max-sm:mx-5 z-50 transition-all duration-300 ${
          !visible ? '-translate-y-[150%]' : 'translate-y-0'
        }`, className)}
      >
        <Menu setActive={setActive}>
            <Link href="/">
                <MenuItem setActive={setActive} active={active} item="Home"></MenuItem>
            </Link>
            <MenuItem setActive={setActive} active={active} item="Books">
            <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/fe">First Year</HoveredLink>
            <HoveredLink href="/se">Second Year</HoveredLink>
            <HoveredLink href="/te">Third Year</HoveredLink>
            <HoveredLink href="/be">Final Year</HoveredLink>
          </div>
            </MenuItem>
            <Link href="/books">
            <MenuItem setActive={setActive} active={active} item="Buy"></MenuItem>
            </Link>
            <Link href="/sell">
            <MenuItem setActive={setActive} active={active} item="Sell"></MenuItem>
            </Link>
            <Link href="/profile">
            <MenuItem setActive={setActive} active={active} item="Profile"></MenuItem>
            </Link>
        </Menu>
      </div>
  )
}

export default Navbar