'use client';

import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/early-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          company_name: companyName
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setMessage(data.message);
        setEmail('');
        setCompanyName('');
      } else {
        setIsSuccess(false);
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
          
          <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
            <div className="flex flex-col gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={isLoading}
                className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Company name (optional)"
                disabled={isLoading}
                className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              <button 
                type="submit"
                disabled={isLoading || !email}
                className="bg-[#2563eb] text-white px-6 py-3 rounded-md font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing Up...' : 'Get Early Access'}
              </button>
            </div>
          </form>

          {message && (
            <div className={`p-4 rounded-md mb-8 ${
              isSuccess 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message}
            </div>
          )}

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
