import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    // Test Supabase connection
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        error: 'Missing Supabase environment variables',
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseKey
      });
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test table structure
    const { data: selectData, error: selectError } = await supabase
      .from('early_access')
      .select('*')
      .limit(1);
    
    if (selectError) {
      return NextResponse.json({
        error: 'Supabase select failed',
        details: selectError
      });
    }
    
    // First disable RLS
    const { error: rlsError } = await supabase.rpc('disable_rls_on_early_access');
    
    // Test insert
    const testEmail = `test-${Date.now()}@example.com`;
    const { data: insertData, error: insertError } = await supabase
      .from('early_access')
      .insert([
        {
          email: testEmail,
          company_name: 'Test Company'
        }
      ])
      .select()
      .single();
    
    if (insertError) {
      return NextResponse.json({
        error: 'Supabase insert failed',
        details: insertError
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Supabase connection and insert working',
      selectData,
      insertData
    });
    
  } catch (error) {
    return NextResponse.json({
      error: 'Test failed',
      details: error
    });
  }
}
