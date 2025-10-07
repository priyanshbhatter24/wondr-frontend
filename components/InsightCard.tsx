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
      className="bg-[#846348] text-white p-6 rounded-lg min-w-[400px] max-w-[400px] cursor-pointer hover:bg-[#755745] transition-colors flex flex-col gap-3"
    >
      {/* Source */}
      <div className="text-xs font-semibold tracking-wider uppercase">
        {source}
      </div>

      {/* Topic */}
      <h3 className="text-lg font-bold leading-tight">{topic}</h3>

      {/* Description */}
      <p className="text-sm leading-relaxed opacity-95">{description}</p>

      {/* Remix Section */}
      <div className="mt-2">
        <div className="text-xs font-semibold tracking-wider uppercase mb-2">
          REMIX
        </div>
        <div className="space-y-1.5">
          {remixOptions.map((option, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="text-sm mt-0.5 flex-shrink-0">•</span>
              <span className="text-sm leading-snug">{option.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
