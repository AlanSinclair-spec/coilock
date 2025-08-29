import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { vendor_id, purchase_amount } = await request.json()
  
  // Mock compliance check - later this queries real COI data
  const vendors: Record<string, any> = {
    'abc-construction': { 
      compliant: true, 
      expiry: '2024-03-15',
      coverage: 2000000
    },
    'xyz-logistics': { 
      compliant: false, 
      expiry: '2024-01-01',
      reason: 'COI expired 30 days ago',
      coverage: 0
    },
    'prime-electric': { 
      compliant: true,
      expiry: '2024-05-20', 
      coverage: 1000000
    }
  }
  
  const vendor = vendors[vendor_id] || { 
    compliant: false, 
    reason: 'No COI on file - vendor not approved'
  }
  
  // This is the enforcement - we actually block the transaction
  if (!vendor.compliant) {
    return NextResponse.json({
      action: 'BLOCKED',
      vendor_id,
      reason: vendor.reason,
      message: `Purchase Order #${Math.random().toString(36).substr(2, 9)} REJECTED`,
      blocked_amount: purchase_amount,
      timestamp: new Date().toISOString()
    })
  }
  
  return NextResponse.json({
    action: 'APPROVED',
    vendor_id,
    message: 'Purchase authorized',
    coverage_limit: vendor.coverage,
    expiry: vendor.expiry
  })
}
