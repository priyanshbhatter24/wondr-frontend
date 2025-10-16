import React from 'react';
import Link from 'next/link';

const WorkflowShowcase = () => {
  return (
    <section className="bg-background py-24 sm:py-32">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-16 md:mb-24">
          <div className="flex flex-col items-start gap-y-5">
            <div className="inline-block bg-secondary text-secondary-foreground rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest">
              BADGE
            </div>
            <h2 className="text-4xl lg:text-[40px] font-semibold tracking-tight leading-[1.2] max-w-lg">
              Designed to get out of your way.
            </h2>
            <p className="text-lg text-text-secondary max-w-md leading-relaxed">
              Stay organized while writing and improving prompts for your favorite AI tools.
            </p>
          </div>
          <Link
            href="/sign-in"
            className="bg-primary text-primary-foreground font-medium rounded-md py-[14px] px-8 text-base whitespace-nowrap transition-transform duration-200 hover:scale-105 flex-shrink-0 self-start md:self-auto"
          >
            Sign In
          </Link>
        </div>

        <div className="w-full aspect-[16/9] rounded-xl border border-white/10 shadow-2xl shadow-black/30 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <p className="text-text-secondary text-xl">Application Interface</p>
            <p className="text-text-tertiary text-sm mt-2">Chat and library features</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowShowcase;
