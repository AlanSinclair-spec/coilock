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
  const [costCalculator, setCostCalculator] = useState({
    monthlyInstalls: '',
    callbacks: '',
    hours: ''
  });
  const [calculatorResults, setCalculatorResults] = useState<{
    callbackCost: number;
    timeCost: number;
    annualLoss: number;
    savings: number;
  } | null>(null);
  
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
      const fallbackMessage = 'Network error. Please email us at menjivarw818@gmail.com or try again.';
      setMessage(fallbackMessage);
      
      trackEvent('form_submit_network_error', {
        form_type: 'email_capture'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateCosts = () => {
    if (!costCalculator.monthlyInstalls || !costCalculator.callbacks || !costCalculator.hours) return;

    const installsMap = { '1-10': 5, '11-25': 18, '26-50': 38, '50+': 75 };
    const callbacksMap = { '0-2': 1, '3-5': 4, '6-10': 8, '10+': 15 };
    const hoursMap = { '<1 hour': 0.5, '1-2 hours': 1.5, '2-4 hours': 3, '4+ hours': 5 };

    const installs = installsMap[costCalculator.monthlyInstalls as keyof typeof installsMap];
    const callbacks = callbacksMap[costCalculator.callbacks as keyof typeof callbacksMap];
    const hours = hoursMap[costCalculator.hours as keyof typeof hoursMap];

    const callbackCost = callbacks * 2847;
    const timeCost = hours * 75 * installs;
    const annualLoss = (callbackCost + timeCost) * 12;
    const savings = annualLoss - 1164; // COILock annual cost ($97 * 12)

    setCalculatorResults({
      callbackCost,
      timeCost,
      annualLoss,
      savings
    });

    trackEvent('cost_calculator_used', {
      monthlyInstalls: costCalculator.monthlyInstalls,
      callbacks: costCalculator.callbacks,
      hours: costCalculator.hours,
      annualLoss,
      savings
    });
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
            Get 50% off for your first 6 months as a founding member
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
              {isLoading ? 'Joining...' : 'Become a Founding Member - $47/month for 6 months, then $97/month'}
            </button>
            
            <div className="text-center mt-3">
              <p className="text-sm text-green-600 font-medium">Save $300 in your first 6 months</p>
            </div>
            
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
                        <div>$97/month</div>
                        <div className="text-xs text-green-600">(Founding members: $47/month for 6 months)</div>
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
              
              {/* Version B: $97 with $47 founding member discount */}
              {version === 'B' && (
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-2">Regular Price: $97/month</div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">$97/month</div>
                  <div className="text-sm text-green-600 font-medium mb-2">Founding Member Special: 50% OFF First 6 Months</div>
                  <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-2">$47/month for 6 months, then $97/month</div>
                  <div className="text-sm text-blue-600 font-medium">Save $300 in your first 6 months</div>
                </div>
              )}
              
              {/* Version A: Updated founding member pricing */}
              {version === 'A' && (
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-2">Regular Price: $97/month</div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">$97/month</div>
                  <div className="text-sm text-green-600 font-medium mb-2">Founding Member Special: 50% OFF First 6 Months</div>
                  <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-2">$47/month for 6 months, then $97/month</div>
                  <div className="text-sm text-blue-600 font-medium">Save $300 in your first 6 months</div>
                </div>
              )}
              
              <div id="signup-form" className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-red-100 text-red-800 mb-4">
              ⚠️ Early Access - Limited Time
            </div>
              <div className="text-sm text-blue-600 font-medium mb-4">
                Avoid $2,847 callbacks - Join the contractors already saving thousands
              </div>
              
              <div className="bg-blue-100 p-4 rounded-lg text-sm text-blue-800">
                <strong>As a founding member, you save $300 over your first 6 months while helping us perfect COILock for the HVAC industry</strong>
              </div>
            </div>
          </div>

          {/* Hidden Callback Cost Calculator */}
          <div className="mt-16 max-w-4xl mx-auto bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200 p-6 sm:p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">What's Your Hidden Callback Cost?</h2>
              <p className="text-gray-600">Calculate how much CO interference callbacks are really costing your business</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Installs</label>
                <select
                  value={costCalculator.monthlyInstalls}
                  onChange={(e) => setCostCalculator({...costCalculator, monthlyInstalls: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select range</option>
                  <option value="1-10">1-10 installs</option>
                  <option value="11-25">11-25 installs</option>
                  <option value="26-50">26-50 installs</option>
                  <option value="50+">50+ installs</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Average Callbacks Per Year</label>
                <select
                  value={costCalculator.callbacks}
                  onChange={(e) => setCostCalculator({...costCalculator, callbacks: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select range</option>
                  <option value="0-2">0-2 callbacks</option>
                  <option value="3-5">3-5 callbacks</option>
                  <option value="6-10">6-10 callbacks</option>
                  <option value="10+">10+ callbacks</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hours on Manual Calculations</label>
                <select
                  value={costCalculator.hours}
                  onChange={(e) => setCostCalculator({...costCalculator, hours: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select range</option>
                  <option value="<1 hour">&lt;1 hour per install</option>
                  <option value="1-2 hours">1-2 hours per install</option>
                  <option value="2-4 hours">2-4 hours per install</option>
                  <option value="4+ hours">4+ hours per install</option>
                </select>
              </div>
            </div>

            <div className="text-center mb-6">
              <button
                onClick={calculateCosts}
                disabled={!costCalculator.monthlyInstalls || !costCalculator.callbacks || !costCalculator.hours}
                className="bg-red-600 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-red-700 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed transition-all duration-200"
              >
                Calculate My Costs
              </button>
            </div>

            {calculatorResults && (
              <div className="bg-white rounded-lg p-6 border border-red-300 animate-fade-in-up">
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Your Annual Cost Breakdown</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">${calculatorResults.callbackCost.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Estimated callback cost</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">${calculatorResults.timeCost.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Time cost monthly</div>
                  </div>
                  <div className="text-center p-4 bg-red-100 rounded-lg sm:col-span-2">
                    <div className="text-3xl font-bold text-red-700">${calculatorResults.annualLoss.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Annual loss</div>
                  </div>
                  <div className="text-center p-4 bg-green-100 rounded-lg sm:col-span-2">
                    <div className="text-3xl font-bold text-green-700">${calculatorResults.savings.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Savings with COILock</div>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-gray-700 mb-4">
                    <strong>COILock helps prevent these losses for just $47/month (founding members)</strong>
                  </p>
                  <button
                    onClick={() => {
                      document.getElementById('signup-form')?.scrollIntoView({ behavior: 'smooth' });
                      trackEvent('cta_click', { location: 'cost_calculator', button_text: 'become_founding_member' });
                    }}
                    className="bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Become a Founding Member
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Founding Member Benefits */}
          <div className="mt-16 max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6 sm:p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Founding Member Benefits</h2>
              <p className="text-gray-600">Join the exclusive group shaping COILock's future</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">50% off for 6 months ($300 savings)</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">Vote on every new feature</span>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">Priority support</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">Early access to new features</span>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">Lock in founding member rate</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => {
                  document.getElementById('signup-form')?.scrollIntoView({ behavior: 'smooth' });
                  trackEvent('cta_click', { location: 'founding_member_benefits', button_text: 'claim_founding_member_pricing' });
                }}
                className="bg-blue-600 text-white px-8 py-4 rounded-md text-lg font-semibold hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Claim Founding Member Pricing
              </button>
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
                <h3 className="text-lg font-semibold text-gray-900 mb-3">What's the pricing structure?</h3>
                <p className="text-gray-600">
                  <strong>Standard price:</strong> $97/month<br/>
                  <strong>Founding member deal:</strong> $47/month for first 6 months<br/>
                  <strong>After 6 months:</strong> Automatically becomes $97/month<br/>
                  No long-term contracts, cancel anytime. Save $300 in your first 6 months.
                </p>
              </div>
              
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
                  href="mailto:menjivarw818@gmail.com" 
                  className="block text-blue-600 hover:text-blue-700 transition-colors font-medium"
                  onClick={() => trackEvent('contact_click', { method: 'email' })}
                >
                  menjivarw818@gmail.com
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
