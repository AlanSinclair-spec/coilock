import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

// Path to the waitlist file
const waitlistPath = path.join(process.cwd(), 'waitlist.json');

export async function POST(request: Request) {
  try {
    const { email, company } = await request.json();
    
    // Validate input
    if (!email || !company) {
      return NextResponse.json(
        { success: false, error: 'Email and company are required' },
        { status: 400 }
      );
    }
    
    const entry = { 
      email, 
      company, 
      timestamp: new Date().toISOString() 
    };
    
    // Read existing entries
    let entries = [];
    try {
      const fileContents = await fs.readFile(waitlistPath, 'utf-8');
      entries = JSON.parse(fileContents);
    } catch (error) {
      // File doesn't exist or is empty, start with empty array
      if (error.code === 'ENOENT') {
        await fs.writeFile(waitlistPath, '[]', 'utf-8');
      } else {
        throw error;
      }
    }
    
    // Add new entry
    entries.push(entry);
    
    // Write back to file
    await fs.writeFile(waitlistPath, JSON.stringify(entries, null, 2), 'utf-8');
    
    // Generate a random position (for demo purposes)
    const position = Math.floor(Math.random() * 900) + 100;
    
    return NextResponse.json({ 
      success: true, 
      position,
      message: 'Added to waitlist successfully!'
    });
    
  } catch (error) {
    console.error('Error adding to waitlist:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add to waitlist' },
      { status: 500 }
    );
  }
}

// Add a GET endpoint to view waitlist (for admin purposes)
export async function GET() {
  try {
    const fileContents = await fs.readFile(waitlistPath, 'utf-8');
    const entries = JSON.parse(fileContents);
    return NextResponse.json(entries);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return NextResponse.json([]);
    }
    console.error('Error reading waitlist:', error);
    return NextResponse.json(
      { error: 'Failed to read waitlist' },
      { status: 500 }
    );
  }
}
