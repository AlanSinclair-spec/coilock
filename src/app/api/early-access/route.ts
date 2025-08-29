import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { email, company_name } = await request.json();
    
    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Initialize Supabase client
    const supabase = await createClient();
    
    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('early_access')
      .select('email')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'This email is already registered for early access' },
        { status: 409 }
      );
    }

    // Insert new early access signup
    const { data, error } = await supabase
      .from('early_access')
      .insert([
        {
          email: email.toLowerCase(),
          company_name: company_name || null,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to register for early access. Please try again.' },
        { status: 500 }
      );
    }

    // Log analytics event
    try {
      await fetch(`${request.headers.get('origin')}/api/analytics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_type: 'early_access_signup',
          data: {
            email: email.toLowerCase(),
            company_name: company_name || 'Not provided',
            source: 'landing_page'
          }
        })
      });
    } catch (analyticsError) {
      // Don't fail the request if analytics fails
      console.warn('Analytics logging failed:', analyticsError);
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully registered for early access!',
      data: {
        id: data.id,
        email: data.email
      }
    });
    
  } catch (error) {
    console.error('Early access signup error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

// GET endpoint for testing
export async function GET() {
  return NextResponse.json({
    message: 'Early Access API endpoint',
    endpoints: {
      POST: 'Register for early access',
      required_fields: ['email'],
      optional_fields: ['company_name']
    },
    example_request: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'user@company.com',
        company_name: 'Acme Corp'
      }, null, 2)
    }
  });
}
