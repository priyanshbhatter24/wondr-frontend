"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function HeroSection() {
  // Heading text on single line
  const heading = "Your AI CMO. Always on.";

  // Description split into two lines
  const descriptionLine1 = "Transform your marketing operations with AI-powered industry insights,";
  const descriptionLine2 = "automated content ideas, and intelligent campaign strategies.";

  // Split into words instead of characters for better wrapping
  const headingWords = heading.split(" ");

  // Animation variants for the heading container
  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03, // 30ms between each letter
      }
    }
  };

  // Animation variants for each letter
  const letterVariants = {
    hidden: {
      opacity: 0,
      x: -20
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1] as const // easeOut cubic bezier
      }
    }
  };

  // Animation variants for description lines (fade in from below)
  const descriptionLineVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1] as const // easeOut cubic bezier
      }
    }
  };

  // Container variant for staggering description lines
  const descriptionContainerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // 200ms between each line
        delayChildren: 0.8, // Start after heading begins
      }
    }
  };

  // Variants for badge and button
  const fadeInVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1] as const // easeOut cubic bezier
      }
    }
  };

  return (
    <section className="relative flex flex-col min-h-screen text-text-primary overflow-hidden">
      {/* Mountain Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-section-mountains.jpg"
          alt="Mountain landscape"
          fill
          priority
          className="object-cover object-center"
          quality={90}
        />
        {/* Desaturation and color grading overlay */}
        <div className="absolute inset-0 bg-black/20 mix-blend-multiply" />
        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black" />
        {/* Subtle vignette effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_black_100%)] opacity-40" />
      </div>

      {/* Subtle grid overlay (optional, can be removed if too busy) */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center flex-grow py-20 text-center px-5 sm:px-10">
        <div className="flex flex-col items-center max-w-[800px] gap-10">
          <div className="flex flex-col items-center gap-6">
            <motion.div
              className="border border-white/10 rounded-full bg-black/20 backdrop-blur-sm"
              initial="hidden"
              animate="visible"
              variants={fadeInVariants}
            >
              <p className="px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                AI-Powered Marketing Platform
              </p>
            </motion.div>

            <h1 className="font-display font-bold text-white text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-[-0.02em] drop-shadow-2xl break-words">
              <motion.span
                className="inline"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {headingWords.map((word, wordIndex) => (
                  <span key={`word-${wordIndex}`} className="inline-block whitespace-nowrap">
                    {word.split("").map((char, charIndex) => (
                      <motion.span
                        key={`char-${wordIndex}-${charIndex}`}
                        variants={letterVariants}
                        className={char === '.' ? 'inline' : 'inline-block'}
                      >
                        {char}
                      </motion.span>
                    ))}
                    {wordIndex < headingWords.length - 1 && <span className="inline">&nbsp;</span>}
                  </span>
                ))}
              </motion.span>
            </h1>

            <motion.div
              className="max-w-[630px] text-lg md:text-xl text-white/90 leading-relaxed drop-shadow-lg"
              variants={descriptionContainerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.p variants={descriptionLineVariants}>
                {descriptionLine1}
              </motion.p>
              <motion.p variants={descriptionLineVariants}>
                {descriptionLine2}
              </motion.p>
            </motion.div>
          </div>
          <motion.div
            className="flex items-center justify-center"
            initial="hidden"
            animate="visible"
            variants={fadeInVariants}
            transition={{ delay: 1.5 }}
          >
            <Link
              href="/sign-in"
              className="bg-primary text-primary-foreground font-medium rounded-lg px-8 py-3.5 text-base hover:opacity-90 transition-opacity duration-200 shadow-2xl"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
