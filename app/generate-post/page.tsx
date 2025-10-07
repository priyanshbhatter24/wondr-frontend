import Sidebar from "@/components/Sidebar";
import { mockGenerations } from "@/lib/mockGenerations";

export default function GeneratePostPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-[color:var(--color-gray-dark)] text-white">
      <Sidebar generations={mockGenerations} />
      <main className="flex-1 overflow-y-auto flex items-center justify-center p-10">
        <div className="max-w-2xl text-center space-y-4">
          <h1 className="text-3xl font-semibold">Generate Post</h1>
          <p className="text-white/70 text-base">
            This area will soon let you craft new campaigns. Use the Idea Hub to the left to
            explore insights and inspirations while we finish wiring up this flow.
          </p>
        </div>
      </main>
    </div>
  );
}
