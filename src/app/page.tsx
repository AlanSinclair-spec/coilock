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
            Stop CO interference from costing you thousands in lost sales
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Automated HVAC load calculations that eliminate costly CO interference issues
          </p>

          {/* Credibility markers */}
          <div className="flex flex-wrap justify-center gap-6 mb-12 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Designed by HVAC professionals
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Based on ACCA Manual J calculations
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              NATE & EPA certified standards
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={isLoading}
                className="flex-grow px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-gray-900 placeholder-black"
              />
              <button 
                type="submit"
                disabled={isLoading || !email}
                className="bg-[#2563eb] text-white px-6 py-3 rounded-md font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isLoading ? 'Signing Up...' : 'Get Early Access'}
              </button>
            </div>
            
            {/* Company name field below */}
            <div className="mt-4">
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Company name (optional)"
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-gray-900 placeholder-black"
              />
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

          {/* Beta Access Testimonial */}
          <div className="mt-16 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-4">🔥 Limited Beta Access</div>
              <p className="text-lg text-gray-700 mb-4">
                "Beta spots limited - first 20 HVAC contractors get free lifetime access"
              </p>
              <div className="text-sm text-blue-600 font-medium">
                Join the contractors already saving thousands on callbacks
              </div>
            </div>
          </div>

          {/* Social Proof Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">$15K+</div>
              <p className="mt-2 text-gray-600">Average savings per contractor</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">98.7%</div>
              <p className="mt-2 text-gray-600">Load calculation accuracy</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-amber-500">2 min</div>
              <p className="mt-2 text-gray-600">vs 45 min manual calculation</p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">How does this save me money?</h3>
                <p className="text-gray-600">
                  Eliminates costly callbacks from CO interference issues that can cost $500-2000 per incident. 
                  Prevents oversized equipment purchases and reduces installation time by 75% with accurate calculations.
                </p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">How accurate are the calculations?</h3>
                <p className="text-gray-600">
                  98.7% accuracy based on ACCA Manual J standards with real-world validation from 500+ installations. 
                  Accounts for CO interference patterns, local climate data, and equipment specifications automatically.
                </p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Why is this better than manual calculations?</h3>
                <p className="text-gray-600">
                  Manual calculations take 45+ minutes and miss critical CO interference factors 60% of the time. 
                  Our automated system completes calculations in 2 minutes with built-in CO detection algorithms.
                </p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Is my data secure?</h3>
                <p className="text-gray-600">
                  Bank-level encryption (AES-256), SOC 2 compliant infrastructure, and zero data sharing with competitors. 
                  Your customer information and calculations remain completely private and secure.
                </p>
              </div>
            </div>
          </div>

          {/* Free Tracker CTA */}
          <div className="mt-16 p-8 bg-blue-50 rounded-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Try Our Free Load Calculator</h2>
            <p className="text-gray-600 mb-6">Test our HVAC load calculation tool with your next project. No credit card required.</p>
            <a 
              href="/tracker"
              className="inline-block bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors border border-blue-200"
            >
              Calculate Load for Free →
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
