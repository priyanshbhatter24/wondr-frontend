import Image from "next/image";

const avatarUrls = [
  // The first avatar asset from the original site was not provided.
  // Using another available avatar as a substitute to maintain the 4-avatar layout.
  'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/def4255d-2d00-4c18-95f2-d0a7e2cd6061-vanta-framer-ai/assets/icons/EVtf6XqSybYVPmXrdJl5kXzH8-1.png?',
  'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/def4255d-2d00-4c18-95f2-d0a7e2cd6061-vanta-framer-ai/assets/icons/sWYguhW9Ubk3HKJhQb1qFj5RRww-2.png?',
  'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/def4255d-2d00-4c18-95f2-d0a7e2cd6061-vanta-framer-ai/assets/icons/edGgFlwNYeIcKCItDjZT2B9xO6M-3.png?',
  // Re-using an avatar to complete the set of four as seen in the design.
  'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/def4255d-2d00-4c18-95f2-d0a7e2cd6061-vanta-framer-ai/assets/icons/EVtf6XqSybYVPmXrdJl5kXzH8-1.png?',
];


const SocialProof = () => {
  return (
    <section className="bg-background py-[120px]">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex flex-col items-center gap-10">
          <div className="flex flex-col items-center gap-5">
            <div className="flex justify-center -space-x-4">
              {avatarUrls.map((url, index) => (
                <Image
                  key={index}
                  className="inline-block size-12 rounded-full object-cover ring-2 ring-border ring-offset-2 ring-offset-background"
                  src={url}
                  alt={`Trusted user ${index + 1}`}
                  width={48}
                  height={48}
                />
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
