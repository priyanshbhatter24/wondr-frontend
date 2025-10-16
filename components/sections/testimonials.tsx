import Image from "next/image";

const testimonials = [
  {
    name: "Lena H.",
    title: "Content Strategist",
    quote: "Switching tone used to be a chore. Now it's fun.",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/def4255d-2d00-4c18-95f2-d0a7e2cd6061-vanta-framer-ai/assets/icons/Q6viON9MsD4DUj4znRWbMTQ4QI-4.png?",
  },
  {
    name: "Raymond K.",
    title: "Growth Marketer",
    quote: "Wondr makes my writing sharper in half the time.",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/def4255d-2d00-4c18-95f2-d0a7e2cd6061-vanta-framer-ai/assets/icons/ffv86nrYC0gqzZ7YPZ7MnMSamk-5.png?",
  },
  {
    name: "Jordan T.",
    title: "Brand Lead",
    quote: "Perfect for testing voice without overthinking.",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/def4255d-2d00-4c18-95f2-d0a7e2cd6061-vanta-framer-ai/assets/icons/5bE49SkYSXIHE0I79vHJ3Iggo-6.png?",
  },
  {
    name: "Sofia M.",
    title: "UX Copywriter",
    quote: "I don't start a landing page without Wondr anymore.",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/def4255d-2d00-4c18-95f2-d0a7e2cd6061-vanta-framer-ai/assets/icons/mKQ3TXme2765ncgoEJUx2BuvnQ-7.png?",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="bg-background-primary py-24 sm:py-32">
      <div className="container">
        <div className="mb-16 flex flex-col items-center gap-8 text-center lg:flex-row lg:items-start lg:justify-between lg:text-left">
          <div className="max-w-2xl">
            <div className="mb-6 inline-block rounded-full bg-secondary px-3.5 py-1.5">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-text-primary">
                Testimonials
              </p>
            </div>
            <h2 className="font-display text-5xl font-semibold leading-tight tracking-tighter text-text-primary">
              What you can do with Wondr
            </h2>
            <p className="mt-5 text-lg text-text-secondary">
              Design better prompts and keep them ready to use whenever you need them.
            </p>
          </div>
          <div className="flex-shrink-0">
            <a
              href="/blog"
              className="inline-block rounded-full border border-border px-8 py-3 text-base font-medium text-text-primary transition hover:bg-secondary"
            >
              Read cases
            </a>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="flex h-full flex-col rounded-3xl bg-gradient-to-b from-[#d4ff33] to-[#c8ff00] p-10 text-black"
            >
              <div className="mb-auto">
                <Image
                  src={testimonial.image}
                  alt={`Avatar of ${testimonial.name}`}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <p className="mt-8 font-serif text-2xl leading-snug tracking-tight text-black">
                  {testimonial.quote}
                </p>
              </div>
              <div className="mt-8">
                <p className="text-base font-semibold text-black">{testimonial.name}</p>
                <p className="text-sm text-black/70">{testimonial.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
