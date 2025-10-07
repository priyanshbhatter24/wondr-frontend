"use client";

interface RemixOption {
  text: string;
}

interface InsightCardProps {
  source: string;
  topic: string;
  description: string;
  remixOptions: RemixOption[];
  onClick: () => void;
}

export default function InsightCard({
  source,
  topic,
  description,
  remixOptions,
  onClick,
}: InsightCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-[#A0826D] text-white p-6 rounded-lg min-w-[380px] max-w-[380px] cursor-pointer hover:bg-[#8F7360] transition-colors flex flex-col gap-4"
    >
      {/* Source */}
      <div className="text-sm font-semibold tracking-wide uppercase">
        {source}
      </div>

      {/* Topic */}
      <h3 className="text-xl font-bold">{topic}</h3>

      {/* Description */}
      <p className="text-sm leading-relaxed opacity-90">{description}</p>

      {/* Remix Section */}
      <div className="mt-4">
        <div className="text-xs font-semibold tracking-wide uppercase mb-3">
          REMIX
        </div>
        <div className="space-y-2">
          {remixOptions.map((option, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 flex-shrink-0" />
              <span className="text-sm">{option.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
