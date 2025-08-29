'use client'
import { useState } from 'react'

interface EnforcementDemoProps {
  vendorId: string;
  vendorName: string;
  compliant: boolean;
}

export function EnforcementDemo({ vendorId, vendorName, compliant }: EnforcementDemoProps) {
  const [blocking, setBlocking] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  const testPurchase = async () => {
    setBlocking(true);
    setResult(null);
    try {
      const res = await fetch('/api/po-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          vendor_id: vendorId, 
          purchase_amount: 50000 
        })
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      setResult({
        action: 'ERROR',
        message: 'Failed to process purchase request'
      });
    } finally {
      setBlocking(false);
    }
  };
  
  return (
    <div className="mt-4 p-4 border rounded-lg">
      <h3 className="font-medium mb-2">PO Enforcement Demo</h3>
      <p className="text-sm text-gray-600 mb-3">
        Test creating a $50,000 PO for {vendorName}
      </p>
      <button 
        onClick={testPurchase}
        disabled={blocking}
        className={`px-4 py-2 rounded-md text-white font-medium ${
          compliant 
            ? 'bg-blue-500 hover:bg-blue-600' 
            : 'bg-red-500 hover:bg-red-600'
        } ${blocking ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {blocking ? 'Processing...' : 'Create PO'}
      </button>
      
      {result && (
        <div className={`mt-3 p-3 rounded-md ${
          result.action === 'BLOCKED' || result.action === 'ERROR' 
            ? 'bg-red-50 border border-red-200 text-red-800' 
            : 'bg-green-50 border border-green-200 text-green-800'
        }`}>
          <div className="font-medium">{result.action}</div>
          <div className="text-sm">{result.message}</div>
          {result.reason && (
            <div className="mt-1 text-xs">Reason: {result.reason}</div>
          )}
        </div>
      )}
      
      <div className="mt-3 text-xs text-gray-500">
        <p>Vendor ID: {vendorId}</p>
        <p>Status: {compliant ? 'Compliant' : 'Non-compliant'}</p>
      </div>
    </div>
  );
}
