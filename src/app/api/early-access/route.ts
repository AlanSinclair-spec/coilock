import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { name, company_name, email, phone, monthly_installs, ab_test_version } = await request.json();
    
    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }
    
    if (!company_name) {
      return NextResponse.json(
        { error: 'Company name is required' },
        { status: 400 }
      );
    }
    
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

    // Initialize Supabase client with anon key
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
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

    // Insert new early access signup (simplified for existing table structure)
    const { data, error } = await supabase
      .from('early_access')
      .insert([
        {
          email: email.toLowerCase(),
          company_name: company_name.trim()
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
      message: 'Welcome aboard! You\'ve locked in founding member pricing. Check your email for next steps.',
      data: {
        id: data.id,
        email: data.email,
        name: data.name
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
