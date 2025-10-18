const testimonials = [
  {
    name: "Lena H.",
    title: "Content Strategist",
    quote: "Wondr's industry insights save me 10+ hours of research every week.",
    initial: "LH",
  },
  {
    name: "Raymond K.",
    title: "Growth Marketer",
    quote: "The ICP targeting is spot-on. Our content resonates better than ever.",
    initial: "RK",
  },
  {
    name: "Jordan T.",
    title: "Brand Lead",
    quote: "Automated research agent finds trends before our competitors do.",
    initial: "JT",
  },
  {
    name: "Sofia M.",
    title: "Marketing Director",
    quote: "From research to post generation — Wondr handles our entire content workflow.",
    initial: "SM",
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
              Marketing teams love Wondr
            </h2>
            <p className="mt-5 text-lg text-text-secondary">
              From research to content creation, see how teams are automating their marketing workflows.
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
              className="flex h-full flex-col bg-gradient-to-b from-[#c0ec1fc7] to-[#c2e936b0] p-6 text-black"
            >
              <div className="mb-auto">
                <div className="h-12 w-12 mb-10 bg-black/10 flex items-center justify-center">
                  <span className="text-black font-semibold text-sm">{testimonial.initial}</span>
                </div>
                <p className="mt-8 mb-12 font-serif text-lg leading-snug tracking-tight text-black">
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
