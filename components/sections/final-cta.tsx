import Link from 'next/link';

const FinalCta = () => {
  return (
    <section className="bg-background-primary flex flex-col items-center justify-center text-center py-24 sm:py-32 md:py-40 px-6">
      <div className="relative w-32 h-32 flex items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
          <span className="text-white text-4xl font-bold">W</span>
        </div>
      </div>

      <h2 className="mt-12 font-display text-[48px] leading-[1.2] font-semibold -tracking-[0.48px] text-text-primary">
        Start writing smarter today.
      </h2>

      <p className="mt-6 text-[20px] leading-[1.6] text-text-secondary max-w-md mx-auto -tracking-[0.1px]">
        Ready to elevate your prompts with Wondr.
      </p>

      <Link
        href="/sign-in"
        className="mt-12 inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3.5 text-base font-medium text-primary-foreground transition-transform duration-200 ease-in-out hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
      >
        Sign In
      </Link>
    </section>
  );
};

export default FinalCta;
