'use client';

import { useState, useEffect } from 'react';

// Honest founding member messaging

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    monthlyInstalls: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  
  // A/B testing for pricing
  // Track which version converts better
  const [version, setVersion] = useState<'A' | 'B'>('B');
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlVersion = urlParams.get('v') as 'A' | 'B' || 'B';
      setVersion(urlVersion);
    }
  }, []);

  const trackEvent = (eventName: string, properties: Record<string, any> = {}) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, {
        ...properties,
        ab_test_version: version
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    trackEvent('form_submit_attempt', {
      form_type: 'email_capture',
      has_phone: !!formData.phone,
      has_monthly_installs: !!formData.monthlyInstalls
    });

    try {
      const response = await fetch('/api/simple-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          company_name: formData.companyName,
          email: formData.email,
          phone: formData.phone,
          monthly_installs: formData.monthlyInstalls,
          ab_test_version: version
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setMessage(data.message);
        setFormData({
          name: '',
          companyName: '',
          email: '',
          phone: '',
          monthlyInstalls: ''
        });
        
        trackEvent('form_submit_success', {
          form_type: 'email_capture',
          user_id: data.data?.id
        });
      } else {
        setIsSuccess(false);
        setMessage(data.error || 'Something went wrong. Please try again.');
        
        trackEvent('form_submit_error', {
          form_type: 'email_capture',
          error: data.error
        });
      }
    } catch (error) {
      setIsSuccess(false);
      const fallbackMessage = 'Network error. Please email us at hello@coilock.com or try again.';
      setMessage(fallbackMessage);
      
      trackEvent('form_submit_network_error', {
        form_type: 'email_capture'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight px-4">
            Stop CO Interference Callbacks That Cost You <span className="currency text-red-600">$2,847</span> Each
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-3 sm:mb-4 max-w-3xl mx-auto px-4">
            Professional CO Compliance System - 70% Less Than ServiceTitan
          </p>
          <p className="text-base sm:text-lg text-blue-600 font-semibold mb-6 sm:mb-8 px-4">
            Early Access Now Available - Founding Member Pricing
          </p>

          {/* Credibility markers */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-6 mb-8 sm:mb-12 text-base sm:text-sm text-gray-600 px-4">
            <div className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Designed by HVAC professionals</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Based on ACCA Manual J calculations</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>NATE & EPA certified standards</span>
            </div>
          </div>
          
          {/* Email signup form */}
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {/* Name - Required */}
              <div className="sm:col-span-1">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Full Name *"
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-4 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-gray-900 placeholder-gray-500"
                />
              </div>
              
              {/* Company Name - Required */}
              <div className="sm:col-span-1">
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  placeholder="Company Name *"
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-4 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-gray-900 placeholder-gray-500"
                />
              </div>
              
              {/* Email - Required */}
              <div className="sm:col-span-1">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Email Address *"
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-4 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-gray-900 placeholder-gray-500"
                />
              </div>
              
              {/* Phone - Optional */}
              <div className="sm:col-span-1">
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="Phone Number"
                  disabled={isLoading}
                  className="w-full px-4 py-4 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>
            
            {/* Monthly Install Volume - Optional */}
            <div className="mb-6">
              <select
                value={formData.monthlyInstalls}
                onChange={(e) => setFormData({...formData, monthlyInstalls: e.target.value})}
                disabled={isLoading}
                className="w-full px-4 py-4 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-gray-900"
              >
                <option value="">Monthly Install Volume (Optional)</option>
                <option value="1-10">1-10 installs per month</option>
                <option value="11-25">11-25 installs per month</option>
                <option value="26-50">26-50 installs per month</option>
                <option value="50+">50+ installs per month</option>
              </select>
            </div>
            
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white px-6 py-4 rounded-md text-base sm:text-lg font-semibold hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none transition-all duration-200 min-h-[44px]"
              onClick={() => trackEvent('cta_click', { location: 'hero_form', button_text: 'become_founding_member' })}
            >
              {isLoading ? 'Joining...' : 'Become a Founding Member - $47/month'}
            </button>
            
            <p className="text-sm sm:text-xs text-gray-500 mt-3 text-center">* Required fields</p>
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

          {/* ROI Section */}
          <div className="mt-12 sm:mt-16 mx-4 p-6 sm:p-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">💰 Return on Investment</div>
              <div className="text-base sm:text-lg text-gray-700 mb-3 sm:mb-4">
                One prevented callback ($2,847) = 29 months of COILock
              </div>
              <div className="text-sm sm:text-sm text-gray-600">
                Break even after preventing just one CO interference callback
              </div>
            </div>
          </div>

          {/* Pricing Comparison Table */}
          <div className="mt-12 sm:mt-16 px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-6 sm:mb-8">Compare Your Options</h2>
            <div className="overflow-x-auto -mx-4 px-4">
              <div className="min-w-[600px]">
                <table className="w-full bg-white rounded-lg shadow-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Solution</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Monthly Cost</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Risk</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium text-gray-900">Manual calculation</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-900">$0/month</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-red-600 font-medium">$2,847 per callback error</td>
                    </tr>
                    <tr>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium text-gray-900">ServiceTitan</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-900">$300-800/month</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-yellow-600">Still requires manual CO calculations</td>
                    </tr>
                    <tr>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium text-gray-900">Engineering consultant</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-900">$500 per project</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-yellow-600">Expensive for multiple projects</td>
                    </tr>
                    <tr className="bg-blue-50">
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium text-blue-900">COILock Professional</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-blue-900">
                        <span className="line-through text-gray-400">$97/month</span>
                        <span className="ml-2 font-bold text-green-600">$47/month (beta)</span>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-green-600 font-medium">Prevents $2,847 callbacks</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Pricing Section - A/B Test */}
          <div className="mt-12 sm:mt-16 mx-4 p-6 sm:p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">🔥 Founding Member Pricing</div>
              
              {/* Version B: $97 with $47 beta discount */}
              {version === 'B' && (
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-2">Regular Price: $97/month | Beta Price: $47/month (50% off forever)</div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-400 line-through mb-2">$97/month</div>
                  <div className="text-sm text-green-600 font-medium mb-2">Founding Member Discount: 50% OFF Forever</div>
                  <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-2">$47/month</div>
                  <div className="text-sm text-gray-600">Lock in this price forever as a founding member</div>
                </div>
              )}
              
              {/* Version A: Original $47 pricing */}
              {version === 'A' && (
                <div className="mb-4">
                  <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">$47/month</div>
                  <div className="text-sm text-gray-600">Special founding member pricing</div>
                </div>
              )}
              
              <div className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4">
                🚀 Now Accepting Founding Members
              </div>
              <div className="text-sm text-blue-600 font-medium">
                Avoid $2,847 callbacks - Join the contractors already saving thousands
              </div>
            </div>
          </div>


          {/* Social Proof Section */}
          <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 px-4">
            <div className="p-6 bg-gray-50 rounded-lg text-center">
              <div className="text-2xl sm:text-3xl font-bold text-red-600">$2,847</div>
              <p className="mt-2 text-base sm:text-sm text-gray-600">Average cost per CO callback</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg text-center">
              <div className="text-2xl sm:text-3xl font-bold text-green-600">ACCA</div>
              <p className="mt-2 text-base sm:text-sm text-gray-600">Manual J compliant</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg text-center">
              <div className="text-2xl sm:text-3xl font-bold text-purple-600">ACCA</div>
              <p className="mt-2 text-base sm:text-sm text-gray-600">Manual J standards compliant</p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">How does this save me money?</h3>
                <p className="text-gray-600">
                  Eliminates costly callbacks from CO interference issues that can cost $2,847 per callback. 
                  Prevents oversized equipment purchases and reduces installation time significantly with accurate calculations.
                </p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">How accurate are the calculations?</h3>
                <p className="text-gray-600">
                  Built according to ACCA Manual J standards. 
                  Accounts for CO interference patterns and equipment specifications.
                </p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Why is this better than manual calculations?</h3>
                <p className="text-gray-600">
                  Manual calculations take 45+ minutes and often miss critical CO interference factors. 
                  Our system helps identify potential CO interference issues during the planning phase.
                </p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Is my data secure?</h3>
                <p className="text-gray-600">
                  Bank-level encryption (AES-256), secure cloud infrastructure, and zero data sharing with competitors. 
                  Your customer information and calculations remain completely private and secure.
                </p>
              </div>
            </div>
          </div>


          {/* Trust Signal */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">✓ Built using ACCA Manual J standards</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">COILock</h3>
              <p className="text-gray-600 mb-4">
                Professional HVAC compliance system that prevents costly CO interference callbacks.
              </p>
              <p className="text-sm text-gray-500">
                © 2025 COILock | Built for HVAC Professionals
              </p>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Contact</h4>
              <div className="space-y-2">
                <p className="text-gray-600">Questions? Email:</p>
                <a 
                  href="mailto:hello@coilock.com" 
                  className="block text-blue-600 hover:text-blue-700 transition-colors font-medium"
                  onClick={() => trackEvent('contact_click', { method: 'email' })}
                >
                  hello@coilock.com
                </a>
              </div>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Legal</h4>
              <div className="space-y-2">
                <a 
                  href="/terms" 
                  className="block text-gray-600 hover:text-blue-600 transition-colors"
                  onClick={() => trackEvent('footer_link_click', { link: 'terms' })}
                >
                  Terms of Service
                </a>
                <a 
                  href="/privacy" 
                  className="block text-gray-600 hover:text-blue-600 transition-colors"
                  onClick={() => trackEvent('footer_link_click', { link: 'privacy' })}
                >
                  Privacy Policy
                </a>
                <a 
                  href="/status" 
                  className="block text-gray-600 hover:text-blue-600 transition-colors"
                  onClick={() => trackEvent('footer_link_click', { link: 'status' })}
                >
                  System Status
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              Trusted by HVAC professionals nationwide
            </p>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <span className="text-sm text-gray-500">A/B Version: {version}</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-subtle"></div>
                <span className="text-xs text-gray-500">System Operational</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
