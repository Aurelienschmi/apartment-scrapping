import { supabase } from '@/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export const POST = async (req: NextRequest) => {
  try {
    const { email, password } = await req.json();
    console.log('Received email:', email);
    console.log('Received password:', password);

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { error } = await supabase
      .from('users')
      .insert([{ email, password: hashedPassword }]);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'User registered successfully' }, { status: 200 });
  } catch (err) {
    console.error('Error handling request:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};

export const GET = async () => {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
};