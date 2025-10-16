"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";

const navLinks = [
  { name: "Features", href: "/features" },
  { name: "Use cases", href: "#" },
  { name: "Pricing", href: "/pricing" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
];

const NavLinkComponent = ({link}: {link: {name: string, href: string}}) => (
  <Link
      href={link.href}
      className="flex items-center gap-1 text-base font-medium text-white/70 hover:text-white transition-colors"
  >
      {link.name}
      {link.name === "Use cases" && <ChevronDown className="h-4 w-4" />}
  </Link>
);


export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/50 backdrop-blur-lg border-b border-white/10" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex h-[80px] items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3 text-white">
          <span className="text-2xl font-semibold">Wondr</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
             <NavLinkComponent key={link.name} link={link} />
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/sign-in"
            className="bg-white text-black px-5 py-3 text-[15px] font-medium rounded-lg hover:bg-opacity-90 transition-opacity"
          >
            Sign In
          </Link>
        </div>

        <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white p-2" aria-label="Open menu">
                <Menu size={24} />
            </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/80 backdrop-blur-lg pb-6">
            <nav className="flex flex-col items-center gap-6 pt-4">
                {navLinks.map((link) => (
                    <NavLinkComponent key={link.name} link={link} />
                ))}
                 <div className="flex flex-col items-center gap-4 pt-2 w-full px-6">
                     <Link
                        href="/sign-in"
                        className="bg-white text-black px-5 py-3 text-[15px] font-medium rounded-lg hover:bg-opacity-90 transition-opacity w-full text-center"
                     >
                        Sign In
                     </Link>
                 </div>
            </nav>
        </div>
      )}
    </header>
  );
}
