import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Define TypeScript interfaces for our analytics events
interface AnalyticsEvent {
  event_type: string;
  data: Record<string, any>;
  timestamp?: string;
  user_agent?: string | null;
  ip_address?: string | null;
}

// Define the expected structure for each event type
interface COIUploadEvent {
  vendor_industry: string;
  coverage_amounts: Record<string, number>;
  carrier: string;
  premium?: number;
  months_until_expiry: number;
}

interface POBlockEvent {
  amount_blocked: number;
  risk_avoided: number;
  vendor_id: string;
  reason: string;
}

interface ComplianceCheckEvent {
  coverage_gap: number;
  industry: string;
  percentile: number;
}

export async function POST(request: Request) {
  try {
    const { event_type, data, metadata = {} } = await request.json();
    
    // Validate required fields
    if (!event_type || !data) {
      return NextResponse.json(
        { error: 'Missing required fields: event_type and data are required' },
        { status: 400 }
      );
    }

    // Initialize Supabase client
    const supabase = await createClient();
    
    // Get client information
    const userAgent = request.headers.get('user-agent');
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip');
    
    // Create analytics event
    const event: AnalyticsEvent = {
      event_type,
      data,
      timestamp: new Date().toISOString(),
      user_agent: userAgent,
      ip_address: ipAddress,
      ...metadata
    };

    // Process different event types
    switch (event_type) {
      case 'coi_upload':
        await processCOIUpload(data as COIUploadEvent);
        break;
        
      case 'po_block':
        await processPOBlock(data as POBlockEvent);
        break;
        
      case 'compliance_check':
        await processComplianceCheck(data as ComplianceCheckEvent);
        break;
        
      default:
        console.warn(`Unknown event type: ${event_type}`);
    }

    // Store the raw event in Supabase
    const { error } = await supabase
      .from('analytics_events')
      .insert([event]);

    if (error) {
      console.error('Error storing analytics event:', error);
      // Continue execution even if storage fails
    }

    return NextResponse.json({ 
      success: true, 
      event_id: Date.now() // In production, use a proper ID
    });
    
  } catch (error) {
    console.error('Analytics processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process analytics event' },
      { status: 500 }
    );
  }
}

// Process COI Upload event
async function processCOIUpload(data: COIUploadEvent) {
  // In a real implementation, this would:
  // 1. Update vendor profiles
  // 2. Generate industry benchmarks
  // 3. Identify upsell opportunities
  
  console.log('Processing COI Upload:', {
    industry: data.vendor_industry,
    coverage: data.coverage_amounts,
    premium: data.premium,
    months_until_expiry: data.months_until_expiry
  });
}

// Process PO Block event
async function processPOBlock(data: POBlockEvent) {
  // In a real implementation, this would:
  // 1. Track risk exposure
  // 2. Update vendor risk scores
  // 3. Generate risk reports
  
  console.log('Processing PO Block:', {
    amount_blocked: data.amount_blocked,
    risk_avoided: data.risk_avoided,
    reason: data.reason
  });
}

// Process Compliance Check event
async function processComplianceCheck(data: ComplianceCheckEvent) {
  // In a real implementation, this would:
  // 1. Update industry benchmarks
  // 2. Generate compliance reports
  // 3. Identify market opportunities
  
  console.log('Processing Compliance Check:', {
    coverage_gap: data.coverage_gap,
    industry: data.industry,
    percentile: data.percentile
  });
}

// Add a GET endpoint for testing (remove in production)
export async function GET() {
  return NextResponse.json({
    message: 'Analytics endpoint is running',
    endpoints: {
      POST: 'Send analytics events',
      GET: 'This help message'
    },
    example_request: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_type: 'coi_upload',
        data: {
          vendor_industry: 'construction',
          coverage_amounts: { general_liability: 2000000 },
          carrier: 'Acme Insurance',
          premium: 5000,
          months_until_expiry: 6
        }
      }, null, 2)
    }
  });
}
