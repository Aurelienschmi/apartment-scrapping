import { supabase } from '@/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const POST = async (req: NextRequest) => {
  try {
    const { email, password } = await req.json();
    console.log('Received email:', email);
    console.log('Received password:', password);

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email);

    console.log('Database response:', data);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (data.length === 0) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 });
    }

    const user = data[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 });
    }

    // Generate a JWT token with user_id
    const token = jwt.sign({ user_id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    // Set the cookie with the JWT token
    const cookie = serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600,
      path: '/',
    });

    return new NextResponse(JSON.stringify({ message: 'Login successful' }), {
      status: 200,
      headers: {
        'Set-Cookie': cookie,
      },
    });
  } catch (err) {
    console.error('Error handling request:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};