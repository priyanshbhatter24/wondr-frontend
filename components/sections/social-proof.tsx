const SocialProof = () => {
  return (
    <section className="bg-background py-[120px]">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex flex-col items-center gap-10">
          <div className="flex flex-col items-center gap-5">
            <div className="flex justify-center -space-x-4">
              {[1, 2, 3, 4].map((index) => (
                <div
                  key={index}
                  className="inline-block size-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 ring-2 ring-border ring-offset-2 ring-offset-background flex items-center justify-center"
                >
                  <span className="text-white text-xs font-semibold">{index}</span>
                </div>
              ))}
            </div>
            <p className="text-base font-medium text-muted-foreground">
              Trusted by 1000+ people from the brands like
            </p>
          </div>

          <div className="flex w-full flex-wrap items-center justify-center gap-y-10 gap-x-[60px] md:justify-between lg:w-auto lg:flex-nowrap lg:justify-center">
            <span className="text-2xl font-light tracking-[0.3em] text-muted-foreground">
              AETHER
            </span>
            <span className="font-serif text-3xl font-normal text-foreground">
              Perfect Days
            </span>
            <span className="font-serif text-4xl italic text-muted-foreground">
              Rasala
            </span>
            <span className="text-2xl font-bold tracking-widest text-foreground">
              CHROMATIC
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
