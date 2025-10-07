export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-[color:var(--color-gray-dark)] text-white flex items-center justify-center p-8">
      <div className="max-w-xl text-center space-y-4">
        <h1 className="text-3xl font-semibold">Gallery</h1>
        <p className="text-white/70 text-sm">
          Your creative assets will appear here. Use the sidebar to switch between Idea Hub, Generate Post,
          and Gallery views while exploring your recent generations.
        </p>
      </div>
    </div>
  );
}
