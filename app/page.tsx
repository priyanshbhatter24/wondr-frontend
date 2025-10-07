import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="text-center max-w-4xl">
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Wondr
        </h1>
        <p className="text-2xl text-gray-700 dark:text-gray-300 mb-8">
          Your AI CMO Brain
        </p>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
          Transform your marketing operations with AI-powered insights, campaign optimization, and intelligent decision-making.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/sign-up"
            className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/sign-in"
            className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg font-semibold border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Sign In
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-3">AI-Powered Insights</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Get intelligent recommendations to optimize your marketing strategy.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-3">Campaign Analytics</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Track and analyze your campaigns with advanced AI-driven metrics.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-3">Smart Automation</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Automate routine tasks and focus on strategic decisions.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
