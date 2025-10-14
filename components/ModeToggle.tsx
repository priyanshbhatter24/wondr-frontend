"use client";

interface ModeToggleProps {
  mode: "plan" | "generate";
  onModeChange: (mode: "plan" | "generate") => void;
  disabled?: boolean;
}

export function ModeToggle({ mode, onModeChange, disabled = false }: ModeToggleProps) {
  return (
    <div className="inline-flex items-center bg-[#252525] rounded-full p-1 border border-white/5">
      <button
        type="button"
        onClick={() => onModeChange("plan")}
        disabled={disabled}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
          mode === "plan"
            ? "bg-white/10 text-white"
            : "text-white/60 hover:text-white/80"
        } disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        Plan
      </button>
      <button
        type="button"
        onClick={() => onModeChange("generate")}
        disabled={disabled}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
          mode === "generate"
            ? "bg-white/10 text-white"
            : "text-white/60 hover:text-white/80"
        } disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        Generate
      </button>
    </div>
  );
}
