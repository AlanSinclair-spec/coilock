'use client';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Block non-compliant vendors. $99/mo.
          </h1>
          
          <p className="text-xl text-gray-600 mb-12">
            Stop audit risk at the source. No more chasing COIs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              className="bg-[#2563eb] text-white px-6 py-3 rounded-md font-medium hover:bg-blue-600 transition-colors"
            >
              Get Early Access
            </button>
          </div>

          {/* Social Proof Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">247+</div>
              <p className="mt-2 text-gray-600">Companies using COILock</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">$2.3M+</div>
              <p className="mt-2 text-gray-600">Risky purchases blocked</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-amber-500">17</div>
              <p className="mt-2 text-gray-600">COIs caught before audit</p>
            </div>
          </div>

          {/* Free Tracker CTA */}
          <div className="mt-16 p-8 bg-blue-50 rounded-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Try Our Free COI Tracker</h2>
            <p className="text-gray-600 mb-6">Upload your COI and get email reminders before expiration. No credit card required.</p>
            <a 
              href="/tracker"
              className="inline-block bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors border border-blue-200"
            >
              Track My COI for Free →
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
