"use client";

import React from "react";
import Link from "next/link";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";

const WondrLogo = ({ className }: { className?: string }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
      <span className="text-white text-xs font-bold">W</span>
    </div>
    <span className="text-xl font-medium text-white">Wondr</span>
  </div>
);

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-32 pb-8 relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="border-t border-white/10 mb-20"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-16 gap-x-8">
          {/* Left Column: Logo, Tagline, Form */}
          <div className="lg:col-span-5 flex flex-col gap-6 items-start">
            <WondrLogo />
            <p className="text-muted-foreground text-base max-w-xs">
              Think deeper, write smarter.
            </p>
            <form className="flex items-center gap-2 w-full max-w-sm mt-2">
              <div className="relative flex-grow">
                <input
                  type="email"
                  placeholder="Enter your email..."
                  className="bg-input border border-input rounded-full h-12 w-full px-5 text-base placeholder:text-muted-foreground focus:ring-1 focus:ring-ring focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="bg-primary text-primary-foreground rounded-full h-12 px-6 font-medium text-base hover:bg-gray-200 transition-colors shrink-0"
              >
                Submit
              </button>
            </form>
          </div>

          {/* Spacer - a bit smaller on smaller screens */}
          <div className="hidden lg:block lg:col-span-1"></div>

          {/* Right Columns: Navigation */}
          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm">
            <div>
              <h4 className="font-medium text-white mb-4 text-base">Product</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-muted-foreground transition-colors hover:text-white">
                    Home
                  </Link>
                </li>
                <li><Link href="#" className="text-muted-foreground hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-white transition-colors">Use cases</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-white transition-colors">Changelog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-4 text-base">Resources</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="text-muted-foreground hover:text-white transition-colors">Blog</Link></li>
                <li>
                  <Link href="#" className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-white">
                    Help <ArrowTopRightIcon className="h-3.5 w-3.5" />
                  </Link>
                </li>
                <li>
                  <Link href="#" className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-white">
                    Tutorials <ArrowTopRightIcon className="h-3.5 w-3.5" />
                  </Link>
                </li>
                <li><Link href="/sign-in" className="text-muted-foreground hover:text-white transition-colors">Sign In</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-4 text-base">Company</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="text-muted-foreground hover:text-white transition-colors">About</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-white transition-colors">Career</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-4 text-base">Legal</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="text-muted-foreground hover:text-white transition-colors">Privacy policy</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-white transition-colors">Terms of use</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Row: Copyright & Socials */}
        <div className="mt-28 flex flex-col-reverse md:flex-row justify-between items-center gap-6 text-sm text-muted-foreground">
          <p className="mt-6 md:mt-0">&copy; Wondr Inc. All rights reserved, 2025.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-white transition-colors">X (Twitter)</Link>
            <Link href="#" className="hover:text-white transition-colors">LinkedIn</Link>
            <Link href="#" className="hover:text-white transition-colors">Dribbble</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
