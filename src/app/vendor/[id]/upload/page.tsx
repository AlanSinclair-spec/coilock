'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Check, Shield, Zap, Users } from 'lucide-react';

export default function VendorUpload({ params }: { params: { id: string } }) {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const vendorName = 'Vendor ' + params.id; // In a real app, fetch from API

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploadStatus('uploading');
    
    // Simulate file processing
    setTimeout(() => {
      // Randomly determine if upload is successful (80% success rate for demo)
      const isSuccess = Math.random() < 0.8;
      
      if (isSuccess) {
        setUploadStatus('success');
      } else {
        setUploadStatus('error');
        setErrorMessage('Invalid COI format. Please upload a valid certificate.');
      }
    }, 1500);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
  });

  const vendorBadge = {
    status: 'unverified',
    monthly_cost: 29,
    benefits: [
      'Share COI with unlimited companies',
      'Priority in search results', 
      'Verified badge on profile',
      'Auto-renewal reminders'
    ],
    network_value: 'Already trusted by 47 companies'
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Verification Badge */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${vendorBadge.status === 'verified' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                {vendorBadge.status === 'verified' ? <Check className="h-5 w-5" /> : <Shield className="h-5 w-5" />}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  {vendorBadge.status === 'verified' ? 'Verified Vendor' : 'Unverified Vendor'}
                </h3>
                <p className="text-sm text-gray-500">
                  {vendorBadge.network_value}
                </p>
              </div>
            </div>
            <button className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
              <Zap className="h-4 w-4" />
              Get Verified - ${vendorBadge.monthly_cost}/mo
            </button>
          </div>
          
          {vendorBadge.status !== 'verified' && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Upgrade to unlock:</h4>
              <ul className="space-y-2">
                {vendorBadge.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Upload Insurance Certificate for {vendorName}
          </h1>
          <p className="text-gray-600">
            Drag and drop your Certificate of Insurance (COI) PDF or click to browse files.
          </p>
        </div>

        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          
          {uploadStatus === 'idle' && (
            <div>
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="mt-4 flex text-sm text-gray-600">
                <p className="pl-1">
                  Drag and drop your COI PDF here, or click to select file
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-2">PDF up to 10MB</p>
            </div>
          )}

          {uploadStatus === 'uploading' && (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
              <p className="text-gray-600">Processing your COI...</p>
            </div>
          )}

          {uploadStatus === 'success' && (
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-green-100 p-3 mb-4">
                <svg
                  className="h-12 w-12 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-lg font-medium text-gray-900">COI Verified!</p>
              <p className="text-green-600 mt-1">This vendor is compliant with your requirements.</p>
              <button 
                onClick={() => setUploadStatus('idle')}
                className="mt-4 text-sm text-[#2563eb] hover:text-blue-700"
              >
                Upload another file
              </button>
            </div>
          )}

          {uploadStatus === 'error' && (
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-red-100 p-3 mb-4">
                <svg
                  className="h-12 w-12 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <p className="text-lg font-medium text-gray-900">Verification Failed</p>
              <p className="text-red-600 mt-1">{errorMessage}</p>
              <button 
                onClick={() => setUploadStatus('idle')}
                className="mt-4 text-sm text-[#2563eb] hover:text-blue-700"
              >
                Try again
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6">
          <h3 className="text-sm font-medium text-gray-900">Need help?</h3>
          <p className="text-sm text-gray-500 mt-2">
            Contact support at support@coilock.com or call (555) 123-4567
          </p>
        </div>
      </div>
    </div>
  );
}
