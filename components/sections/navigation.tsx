"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);

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

        <Link
          href="/sign-in"
          className="bg-white text-black px-5 py-3 text-[15px] font-medium rounded-lg hover:bg-opacity-90 transition-opacity"
        >
          Sign In
        </Link>
      </div>
    </header>
  );
}
