import { NextResponse } from 'next/server';

// This enables vendor network effect - one upload serves multiple companies
export async function POST(request: Request) {
  const { vendor_id, coi_id, share_with_companies } = await request.json();
  
  // Validate input
  if (!vendor_id || !coi_id || !Array.isArray(share_with_companies)) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  // Mock: Track which companies have access to which COIs
  const shares = share_with_companies.map((company_id: string) => ({
    vendor_id,
    coi_id,
    company_id,
    shared_at: new Date().toISOString(),
    status: 'active',
    permissions: ['view', 'download']
  }));
  
  // In a real implementation, you would save this to a database
  console.log('Shares created:', shares);
  
  return NextResponse.json({
    success: true,
    shares_created: shares.length,
    message: `COI shared with ${shares.length} companies`,
    timestamp: new Date().toISOString()
  });
}

// Add TypeScript interfaces for better type safety
interface ShareRequest {
  vendor_id: string;
  coi_id: string;
  share_with_companies: string[];
}

interface ShareRecord {
  vendor_id: string;
  coi_id: string;
  company_id: string;
  shared_at: string;
  status: 'active' | 'revoked';
  permissions: string[];
}
