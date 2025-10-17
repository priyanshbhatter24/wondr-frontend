"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HeroSection() {
  // Split text into individual characters while preserving spaces
  const line1 = "Your AI CMO.";
  const line2 = "Always on.";
  const description = "Transform your marketing operations with AI-powered industry insights, automated content ideas, and intelligent campaign strategies.";

  const line1Chars = line1.split("");
  const line2Chars = line2.split("");
  const descriptionChars = description.split("");

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

  // Animation variants for the description container
  const descriptionContainerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.015, // 15ms between each letter for description (faster for longer text)
        delayChildren: 0.8, // Start after heading animation
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
        ease: "easeOut"
      }
    }
  };

  // Animation variants for description letters (slightly faster)
  const descriptionLetterVariants = {
    hidden: {
      opacity: 0,
      x: -10
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
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
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="relative flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-text-primary">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800/20 via-transparent to-transparent" />
      <div className="absolute inset-0 z-0 opacity-30">
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
              <p className="px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white">
                AI-Powered Marketing Platform
              </p>
            </motion.div>

            <h1 className="font-display font-semibold text-white text-4xl md:text-6xl lg:text-7xl leading-[1.1] tracking-[-0.04em]">
              <motion.span
                className="inline-block"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {line1Chars.map((char, index) => (
                  <motion.span
                    key={`line1-${index}`}
                    variants={letterVariants}
                    className="inline-block"
                    style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </motion.span>
              <br />
              <motion.span
                className="inline-block"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {line2Chars.map((char, index) => (
                  <motion.span
                    key={`line2-${index}`}
                    variants={letterVariants}
                    className="inline-block"
                    style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </motion.span>
            </h1>

            <motion.p
              className="max-w-[630px] text-lg md:text-xl text-text-secondary leading-relaxed"
              variants={descriptionContainerVariants}
              initial="hidden"
              animate="visible"
            >
              {descriptionChars.map((char, index) => (
                <motion.span
                  key={`desc-${index}`}
                  variants={descriptionLetterVariants}
                  className="inline-block"
                  style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </motion.p>
          </div>
          <motion.div
            className="flex items-center justify-center"
            initial="hidden"
            animate="visible"
            variants={fadeInVariants}
            transition={{ delay: 3.0 }}
          >
            <Link
              href="/sign-in"
              className="bg-primary text-primary-foreground font-medium rounded-lg px-8 py-3.5 text-base hover:opacity-90 transition-opacity duration-200"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
