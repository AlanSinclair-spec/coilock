import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Types
type WebhookPayload = {
  vendor_ein: string;
  po_amount: number;
  company_id: string;
  po_number?: string;
  po_date?: string;
  items?: Array<{
    sku: string;
    quantity: number;
    unit_price: number;
  }>;
};

type ComplianceCheckResult = {
  isCompliant: boolean;
  reason?: string;
  required_coverage?: number;
  current_coverage?: number;
  expiry_date?: string | null;
};

// Mock function to check vendor compliance
// In production, this would query your database
async function checkVendorCompliance(vendorEin: string): Promise<ComplianceCheckResult> {
  // This is a mock implementation
  // In a real implementation, you would:
  // 1. Query your database for the vendor's current COI
  // 2. Check if it's valid, not expired, and meets requirements
  
  // For demo purposes, let's say 20% of vendors are non-compliant
  const isCompliant = Math.random() > 0.2;
  
  if (!isCompliant) {
    return {
      isCompliant: false,
      reason: 'COI expired or insufficient coverage',
      required_coverage: 1000000,
      current_coverage: 500000,
      expiry_date: '2023-12-31'
    };
  }
  
  return { isCompliant: true };
}

// Mock function to notify accounting system
async function notifyAccounting(companyId: string, eventType: string): Promise<void> {
  // In production, this would integrate with your accounting system
  console.log(`[${new Date().toISOString()}] Notifying accounting system:`, {
    companyId,
    eventType
  });
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 200));
}

// Mock function to log blocked transactions
async function logBlockedTransaction(amount: number, metadata: Record<string, any> = {}): Promise<void> {
  const supabase = await createClient();
  
  // In production, you would store this in a dedicated table
  const { error } = await supabase
    .from('blocked_transactions')
    .insert([
      {
        amount,
        metadata,
        created_at: new Date().toISOString()
      }
    ]);
    
  if (error) {
    console.error('Failed to log blocked transaction:', error);
    // Don't throw - we don't want to fail the request just because logging failed
  }
}

export async function POST(request: Request) {
  try {
    const payload: WebhookPayload = await request.json();
    
    // Validate required fields
    if (!payload.vendor_ein || !payload.company_id || payload.po_amount === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: vendor_ein, company_id, and po_amount are required' },
        { status: 400 }
      );
    }

    // Check compliance in real-time
    const compliance = await checkVendorCompliance(payload.vendor_ein);
    
    if (!compliance.isCompliant) {
      // Log the blocked transaction
      await logBlockedTransaction(payload.po_amount, {
        vendor_ein: payload.vendor_ein,
        company_id: payload.company_id,
        po_number: payload.po_number,
        reason: compliance.reason,
        required_coverage: compliance.required_coverage,
        current_coverage: compliance.current_coverage,
        expiry_date: compliance.expiry_date
      });
      
      // Notify accounting system
      await notifyAccounting(payload.company_id, 'PO_BLOCKED');
      
      return NextResponse.json({
        action: 'BLOCK_TRANSACTION',
        message: 'Vendor insurance non-compliant',
        reason: compliance.reason,
        instruction: 'DO_NOT_PROCESS',
        details: {
          required_coverage: compliance.required_coverage,
          current_coverage: compliance.current_coverage,
          expiry_date: compliance.expiry_date
        }
      });
    }
    
    // If we get here, the vendor is compliant
    return NextResponse.json({ 
      action: 'ALLOW',
      message: 'Vendor is compliant',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('ERP Webhook Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Add a GET endpoint for testing (remove in production)
export async function GET() {
  return NextResponse.json({
    message: 'ERP Webhook is running',
    endpoints: {
      POST: 'Process PO and check compliance',
      GET: 'This help message'
    },
    example_request: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vendor_ein: '12-3456789',
        po_amount: 50000,
        company_id: 'acme-corp',
        po_number: 'PO-2023-1234',
        po_date: '2023-11-15',
        items: [
          { sku: 'ITEM-001', quantity: 10, unit_price: 1000 }
        ]
      }, null, 2)
    }
  });
}
