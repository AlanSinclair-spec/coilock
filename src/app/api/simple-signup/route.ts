import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Fallback in-memory storage if Supabase fails
const signups: Array<{
  id: string;
  name: string;
  company_name: string;
  email: string;
  phone?: string;
  monthly_installs?: string;
  ab_test_version: string;
  created_at: string;
}> = [];

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

    // Try to save to Supabase first
    try {
      const { data, error } = await supabase
        .from('early_access_signups')
        .insert([{
          name: name.trim(),
          company_name: company_name.trim(),
          email: email.toLowerCase(),
          phone: phone?.trim() || null,
          monthly_installs: monthly_installs || null,
          ab_test_version: ab_test_version || 'B'
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
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

    } catch (supabaseError) {
      console.error('Supabase failed, using fallback storage:', supabaseError);
      
      // Fallback to in-memory storage
      const existingSignup = signups.find(signup => 
        signup.email.toLowerCase() === email.toLowerCase()
      );
      
      if (existingSignup) {
        return NextResponse.json(
          { error: 'This email is already registered for early access' },
          { status: 409 }
        );
      }

      const newSignup = {
        id: `signup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: name.trim(),
        company_name: company_name.trim(),
        email: email.toLowerCase(),
        phone: phone?.trim() || undefined,
        monthly_installs: monthly_installs || undefined,
        ab_test_version: ab_test_version || 'B',
        created_at: new Date().toISOString()
      };

      signups.push(newSignup);

      return NextResponse.json({
        success: true,
        message: 'Welcome aboard! You\'ve locked in founding member pricing. Check your email for next steps.',
        data: {
          id: newSignup.id,
          email: newSignup.email,
          name: newSignup.name
        }
      });
    }
    
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

// GET endpoint to view signups (for testing)
export async function GET() {
  return NextResponse.json({
    total_signups: signups.length,
    signups: signups.map(signup => ({
      id: signup.id,
      name: signup.name,
      company_name: signup.company_name,
      email: signup.email,
      phone: signup.phone,
      monthly_installs: signup.monthly_installs,
      ab_test_version: signup.ab_test_version,
      created_at: signup.created_at
    }))
  });
}
