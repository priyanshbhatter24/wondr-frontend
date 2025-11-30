"use client";

import { ChevronRightIcon } from "@radix-ui/react-icons";
import { CompetitorAggregatedData } from "@/types/competitor-research";

interface CompetitorSelectorProps {
  competitors: { [name: string]: CompetitorAggregatedData };
  selectedCompetitor: string | null;
  onSelect: (name: string) => void;
}

export default function CompetitorSelector({
  competitors,
  selectedCompetitor,
  onSelect,
}: CompetitorSelectorProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
      {Object.entries(competitors).map(([name, data]) => {
        const isSelected = selectedCompetitor === name;
        
        return (
          <button
            key={name}
            onClick={() => onSelect(name)}
            className={`
              flex items-center justify-between p-4 min-w-[260px] rounded-xl border transition-all duration-200 group
              ${isSelected 
                ? "bg-[#252525] border-white/20 shadow-lg" 
                : "bg-[#1A1A1A] border-transparent hover:bg-[#222] hover:border-white/10"
              }
            `}
          >
            <div className="flex items-center gap-3">
              {/* Logo or Fallback */}
              {data.logo_url ? (
                <div className="w-10 h-10 rounded-full overflow-hidden bg-white flex-shrink-0 border border-white/10">
                  <img src={data.logo_url} alt={name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 text-black font-bold text-lg border border-white/10">
                  {name[0].toUpperCase()}
                </div>
              )}
              
              <div className="text-left">
                {/* Reduced font size from base/medium to sm/medium */}
                <h3 className={`text-sm font-medium leading-tight ${isSelected ? "text-white" : "text-white/80 group-hover:text-white"}`}>
                  {name}
                </h3>
                <p className="text-xs text-blue-400 mt-1">
                  {data.total_posts} new updates
                </p>
              </div>
            </div>

            <ChevronRightIcon className={`w-5 h-5 transition-transform ${isSelected ? "text-white" : "text-white/20 group-hover:text-white/60"}`} />
          </button>
        );
      })}
    </div>
  );
}
