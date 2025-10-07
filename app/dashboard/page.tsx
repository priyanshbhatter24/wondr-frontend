import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Wondr Dashboard</h1>
          <UserButton afterSignOutUrl="/" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Welcome to Wondr</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Your AI CMO brain is ready to help with marketing operations.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Get Started</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Connect your marketing platforms and start analyzing campaigns.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">AI Insights</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Get intelligent recommendations for your marketing strategy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}