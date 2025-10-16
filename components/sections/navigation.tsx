"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDownIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";

const navLinks = [
  { name: "Features", href: "/features" },
  { name: "Use cases", href: "#" },
  { name: "Pricing", href: "/pricing" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
];

const NavLinkComponent = ({ link }: { link: { name: string; href: string } }) => (
  <Link
    href={link.href}
    className="flex items-center gap-1 text-base font-medium text-white/70 transition-colors hover:text-white"
  >
    {link.name}
    {link.name === "Use cases" && <ChevronDownIcon className="h-4 w-4" />}
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
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-white"
            aria-label="Toggle menu"
          >
            <HamburgerMenuIcon className="h-6 w-6" />
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/80 backdrop-blur-lg pb-6">
            <nav className="flex flex-col items-center gap-6 pt-4">
            {navLinks.map((link) => (
              <NavLinkComponent key={link.name} link={link} />
            ))}
            <div className="flex w-full flex-col items-center gap-4 px-6 pt-2">
              <Link
                href="/sign-in"
                className="w-full rounded-lg bg-white px-5 py-3 text-center text-[15px] font-medium text-black transition-opacity hover:bg-opacity-90"
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
