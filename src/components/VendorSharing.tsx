'use client';

import { useState } from 'react';

interface Company {
  id: string;
  name: string;
  selected: boolean;
}

interface VendorSharingProps {
  vendorId: string;
  coiId: string;
  companies: Company[];
}

export function VendorSharing({ vendorId, coiId, companies: initialCompanies }: VendorSharingProps) {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message?: string }>({ type: 'idle' });
  const [shareLink, setShareLink] = useState('');

  const toggleCompany = (companyId: string) => {
    setCompanies(companies.map(company => 
      company.id === companyId 
        ? { ...company, selected: !company.selected } 
        : company
    ));
  };

  const handleShare = async () => {
    const selectedCompanyIds = companies
      .filter(company => company.selected)
      .map(company => company.id);

    if (selectedCompanyIds.length === 0) {
      setStatus({ type: 'error', message: 'Please select at least one company' });
      return;
    }

    setStatus({ type: 'loading', message: 'Sharing COI...' });

    try {
      const response = await fetch('/api/vendor-share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendor_id: vendorId,
          coi_id: coiId,
          share_with_companies: selectedCompanyIds
        })
      });

      if (!response.ok) {
        throw new Error('Failed to share COI');
      }

      const data = await response.json();
      setStatus({ 
        type: 'success', 
        message: data.message 
      });
      
      // Generate a shareable link (in a real app, this would be a proper route)
      setShareLink(`${window.location.origin}/coi/${coiId}`);
      
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: 'Failed to share COI. Please try again.' 
      });
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <h3 className="text-lg font-medium mb-4">Share COI with Companies</h3>
      
      <div className="space-y-2 mb-6 max-h-60 overflow-y-auto p-2 border rounded">
        {companies.map((company) => (
          <div key={company.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
            <input
              type="checkbox"
              id={`company-${company.id}`}
              checked={company.selected}
              onChange={() => toggleCompany(company.id)}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <label htmlFor={`company-${company.id}`} className="text-sm font-medium text-gray-700">
              {company.name}
            </label>
          </div>
        ))}
      </div>

      <button
        onClick={handleShare}
        disabled={status.type === 'loading'}
        className={`w-full py-2 px-4 rounded-md text-white font-medium ${
          status.type === 'loading' 
            ? 'bg-blue-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {status.type === 'loading' ? 'Sharing...' : 'Share with Selected Companies'}
      </button>

      {status.message && (
        <div className={`mt-4 p-3 rounded-md text-sm ${
          status.type === 'error' 
            ? 'bg-red-50 text-red-700' 
            : 'bg-green-50 text-green-700'
        }`}>
          {status.message}
        </div>
      )}

      {shareLink && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600 mb-2">Shareable Link:</p>
          <div className="flex">
            <input
              type="text"
              readOnly
              value={shareLink}
              className="flex-1 p-2 border rounded-l-md text-sm font-mono"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(shareLink);
                setStatus({ type: 'success', message: 'Link copied to clipboard!' });
              }}
              className="bg-gray-200 hover:bg-gray-300 px-3 rounded-r-md text-sm font-medium"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
