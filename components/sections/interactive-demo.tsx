"use client";

import Image from "next/image";

const InteractiveDemo = () => {
  return (
    <section className="relative flex w-full flex-col items-center gap-[60px] overflow-hidden bg-black px-5 py-[120px] md:px-10">
      {/* Background Image */}
      <Image
        src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/def4255d-2d00-4c18-95f2-d0a7e2cd6061-vanta-framer-ai/assets/images/6mKInppQSXEURMBjwInrovyJSo-7.png?"
        alt="Blurred scenic background of green hills"
        fill
        className="pointer-events-none object-cover"
        quality={100}
      />

      {/* Heading Content */}
      <div className="z-10 flex max-w-[720px] flex-col items-center gap-5 text-center">
        <div className="inline-flex items-center justify-center rounded-full bg-white/10 px-3 py-1">
          <p className="font-semibold uppercase text-text-primary text-[11px] leading-none tracking-[0.05em]">
            Badge
          </p>
        </div>
        <h2 className="font-display text-5xl font-semibold leading-[1.2] tracking-[-0.01em] text-text-primary">
          Try it instantly.
        </h2>
        <p className="max-w-[560px] text-lg leading-[1.6] text-text-secondary">
          Build smarter prompts faster — and keep them all in one organized place.
        </p>
      </div>

      {/* Interactive Demo Image */}
      <div className="relative z-10 w-full max-w-[1020px]">
        <Image
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/def4255d-2d00-4c18-95f2-d0a7e2cd6061-vanta-framer-ai/assets/images/JhTZiJszUUkoL3zCNwUAdiF7NhQ-4.png?"
          alt="Interactive chat interface mockup for Wondr AI"
          width={8320}
          height={4623}
          className="h-auto w-full rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.4)]"
          priority
        />
      </div>
    </section>
  );
};

export default InteractiveDemo;
