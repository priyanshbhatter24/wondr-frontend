"use client";

const InteractiveDemo = () => {
  return (
    <section className="relative flex w-full flex-col items-center gap-[60px] overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black px-5 py-[120px] md:px-10">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800/10 via-transparent to-transparent pointer-events-none" />

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

      {/* Interactive Demo Placeholder */}
      <div className="relative z-10 w-full max-w-[1020px]">
        <div className="w-full aspect-[16/9] rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.4)] flex items-center justify-center">
          <div className="text-center">
            <p className="text-text-secondary text-lg">Interactive Demo</p>
            <p className="text-text-tertiary text-sm mt-2">Chat interface mockup</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveDemo;
