"use client";

import React from 'react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-text-primary">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800/20 via-transparent to-transparent" />
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center flex-grow py-20 text-center px-5 sm:px-10">
        <div className="flex flex-col items-center max-w-[800px] gap-10">
          <div className="flex flex-col items-center gap-6">
            <div className="border border-white/10 rounded-full bg-black/20 backdrop-blur-sm">
              <p className="px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white">
                Powerful AI Tool
              </p>
            </div>
            <h1 className="font-display font-semibold text-white text-5xl md:text-7xl lg:text-[96px] leading-[1.1] tracking-[-0.04em]">
              Think deeper.
              <br />
              Dream impossible.
            </h1>
            <p className="max-w-[630px] text-lg md:text-xl text-text-secondary leading-relaxed">
              Wondr helps you create, optimize, and organize powerful marketing strategies with AI-powered insights.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/sign-in"
              className="bg-primary text-primary-foreground font-medium rounded-lg px-8 py-3.5 text-base hover:opacity-90 transition-opacity duration-200"
            >
              Sign In
            </Link>
            <a
              href="https://www.youtube.com/@Framer"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-interactive-secondary text-primary border border-border-subtle font-medium rounded-lg px-8 py-3.5 text-base hover:bg-white/20 transition-colors duration-200"
            >
              Watch demo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
