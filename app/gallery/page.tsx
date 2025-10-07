import Sidebar from "@/components/Sidebar";
import { mockGenerations } from "@/lib/mockGenerations";

export default function GalleryPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-[color:var(--color-gray-dark)] text-white">
      <Sidebar generations={mockGenerations} />
      <main className="flex-1 overflow-y-auto flex items-center justify-center p-10">
        <div className="max-w-2xl text-center space-y-4">
          <h1 className="text-3xl font-semibold">Gallery</h1>
          <p className="text-white/70 text-base">
            Browse previously generated assets and creative explorations. We are working on
            surfacing real content here soon.
          </p>
        </div>
      </main>
    </div>
  );
}
