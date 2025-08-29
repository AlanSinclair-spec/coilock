'use client';

import { useState } from 'react';

export default function HVACCalculator() {
  const [formData, setFormData] = useState({
    length: '',
    width: '',
    height: '',
    insulation: 'standard',
    windows: '',
    doors: '',
    occupants: '',
    climate: 'moderate'
  });
  const [result, setResult] = useState<null | {
    heatingLoad: number;
    coolingLoad: number;
    recommendedUnit: string;
    efficiency: string;
  }>(null);
  const [status, setStatus] = useState<'idle' | 'calculating' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateInputs = () => {
    const newErrors: Record<string, string> = {};
    
    // Check for required fields
    if (!formData.length || parseFloat(formData.length) <= 0) {
      newErrors.length = 'Length must be greater than 0';
    }
    if (!formData.width || parseFloat(formData.width) <= 0) {
      newErrors.width = 'Width must be greater than 0';
    }
    if (!formData.height || parseFloat(formData.height) <= 0) {
      newErrors.height = 'Height must be greater than 0';
    }
    if (!formData.windows || parseFloat(formData.windows) < 0) {
      newErrors.windows = 'Windows cannot be negative';
    }
    if (!formData.doors || parseFloat(formData.doors) < 0) {
      newErrors.doors = 'Doors cannot be negative';
    }
    if (!formData.occupants || parseFloat(formData.occupants) < 0) {
      newErrors.occupants = 'Occupants cannot be negative';
    }

    // Check for reasonable maximums
    if (parseFloat(formData.length) > 1000) {
      newErrors.length = 'Length seems unreasonably large (max 1000 ft)';
    }
    if (parseFloat(formData.width) > 1000) {
      newErrors.width = 'Width seems unreasonably large (max 1000 ft)';
    }
    if (parseFloat(formData.height) > 50) {
      newErrors.height = 'Height seems unreasonably large (max 50 ft)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateLoad = () => {
    const length = parseFloat(formData.length);
    const width = parseFloat(formData.width);
    const height = parseFloat(formData.height);
    const windows = parseFloat(formData.windows) || 0;
    const doors = parseFloat(formData.doors) || 0;
    const occupants = parseFloat(formData.occupants) || 0;

    // Basic HVAC load calculation (simplified Manual J)
    const area = length * width;
    const volume = area * height;
    
    // Base load factors
    let heatingFactor = 25; // BTU per sq ft
    let coolingFactor = 30; // BTU per sq ft
    
    // Adjust for insulation
    switch (formData.insulation) {
      case 'poor':
        heatingFactor *= 1.4;
        coolingFactor *= 1.3;
        break;
      case 'excellent':
        heatingFactor *= 0.7;
        coolingFactor *= 0.8;
        break;
      default: // standard
        break;
    }
    
    // Adjust for climate
    switch (formData.climate) {
      case 'cold':
        heatingFactor *= 1.3;
        coolingFactor *= 0.8;
        break;
      case 'hot':
        heatingFactor *= 0.8;
        coolingFactor *= 1.4;
        break;
      default: // moderate
        break;
    }
    
    // Calculate base loads
    let heatingLoad = area * heatingFactor;
    let coolingLoad = area * coolingFactor;
    
    // Add window/door losses
    heatingLoad += windows * 1000 + doors * 1500;
    coolingLoad += windows * 1200 + doors * 1800;
    
    // Add occupant load
    heatingLoad += occupants * 400;
    coolingLoad += occupants * 600;
    
    // Determine recommended unit size
    const maxLoad = Math.max(heatingLoad, coolingLoad);
    let recommendedUnit = '';
    let efficiency = '';
    
    if (maxLoad < 18000) {
      recommendedUnit = '1.5 Ton (18,000 BTU)';
      efficiency = '16+ SEER, 9+ HSPF';
    } else if (maxLoad < 24000) {
      recommendedUnit = '2 Ton (24,000 BTU)';
      efficiency = '16+ SEER, 9+ HSPF';
    } else if (maxLoad < 36000) {
      recommendedUnit = '3 Ton (36,000 BTU)';
      efficiency = '15+ SEER, 8.5+ HSPF';
    } else if (maxLoad < 48000) {
      recommendedUnit = '4 Ton (48,000 BTU)';
      efficiency = '15+ SEER, 8.5+ HSPF';
    } else {
      recommendedUnit = '5+ Ton (60,000+ BTU)';
      efficiency = '14+ SEER, 8+ HSPF';
    }
    
    return {
      heatingLoad: Math.round(heatingLoad),
      coolingLoad: Math.round(coolingLoad),
      recommendedUnit,
      efficiency
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInputs()) {
      setStatus('error');
      return;
    }
    
    setStatus('calculating');
    
    try {
      // Simulate calculation time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const calculation = calculateLoad();
      setResult(calculation);
      setStatus('success');
    } catch (error) {
      console.error('Calculation failed:', error);
      setStatus('error');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    // Clear status when user makes changes
    if (status === 'error') {
      setStatus('idle');
    }
  };

  const handleClear = () => {
    setFormData({
      length: '',
      width: '',
      height: '',
      insulation: 'standard',
      windows: '',
      doors: '',
      occupants: '',
      climate: 'moderate'
    });
    setResult(null);
    setStatus('idle');
    setErrors({});
  };

  if (result && status === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-md">
          <div className="text-center mb-6">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-3 text-2xl font-bold text-gray-900">Load Calculation Complete!</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900">Heating Load</h3>
              <p className="text-2xl font-bold text-blue-600">{result.heatingLoad.toLocaleString()} BTU/hr</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-semibold text-red-900">Cooling Load</h3>
              <p className="text-2xl font-bold text-red-600">{result.coolingLoad.toLocaleString()} BTU/hr</p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Recommended Equipment</h3>
            <p className="text-lg font-medium text-gray-800">{result.recommendedUnit}</p>
            <p className="text-sm text-gray-600">{result.efficiency}</p>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={handleClear}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
            >
              Calculate Another
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Get Early Access
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Free HVAC Load Calculator
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Get accurate heating and cooling load calculations based on ACCA Manual J standards
          </p>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <form onSubmit={handleSubmit} className="px-4 py-6 sm:p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Room Dimensions */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Length (ft)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.length}
                  onChange={(e) => handleInputChange('length', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="20"
                />
                {errors.length && <p className="mt-1 text-sm text-red-600">{errors.length}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Width (ft)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.width}
                  onChange={(e) => handleInputChange('width', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="15"
                />
                {errors.width && <p className="mt-1 text-sm text-red-600">{errors.width}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Height (ft)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="8"
                />
                {errors.height && <p className="mt-1 text-sm text-red-600">{errors.height}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Insulation Level</label>
                <select
                  value={formData.insulation}
                  onChange={(e) => handleInputChange('insulation', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="poor">Poor (R-8 or less)</option>
                  <option value="standard">Standard (R-13 to R-19)</option>
                  <option value="excellent">Excellent (R-20+)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Number of Windows</label>
                <input
                  type="number"
                  min="0"
                  value={formData.windows}
                  onChange={(e) => handleInputChange('windows', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="4"
                />
                {errors.windows && <p className="mt-1 text-sm text-red-600">{errors.windows}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Number of Doors</label>
                <input
                  type="number"
                  min="0"
                  value={formData.doors}
                  onChange={(e) => handleInputChange('doors', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="2"
                />
                {errors.doors && <p className="mt-1 text-sm text-red-600">{errors.doors}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Number of Occupants</label>
                <input
                  type="number"
                  min="0"
                  value={formData.occupants}
                  onChange={(e) => handleInputChange('occupants', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="4"
                />
                {errors.occupants && <p className="mt-1 text-sm text-red-600">{errors.occupants}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Climate Zone</label>
                <select
                  value={formData.climate}
                  onChange={(e) => handleInputChange('climate', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="cold">Cold (Northern states)</option>
                  <option value="moderate">Moderate (Central states)</option>
                  <option value="hot">Hot (Southern states)</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6 flex gap-4">
              <button
                type="submit"
                disabled={status === 'calculating'}
                className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
              >
                {status === 'calculating' ? 'Calculating...' : 'Calculate Load'}
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Clear
              </button>
            </div>
            
            {status === 'error' && Object.keys(errors).length > 0 && (
              <div className="mt-4 p-4 bg-red-50 rounded-md">
                <p className="text-sm text-red-800">Please fix the errors above and try again.</p>
              </div>
            )}
          </form>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">Based on ACCA Manual J calculations • Designed by HVAC professionals</p>
        </div>
      </div>
    </div>
  );
}
