import { supabase } from '@/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const GET = async (req: NextRequest) => {
  try {
    const tokenCookie = req.cookies.get('token');
    const token = tokenCookie ? tokenCookie.value : null;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

    const { data, error } = await supabase
      .from('users')
      .select('email')
      .eq('email', decoded.email)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ user: data }, { status: 200 });
  } catch (err) {
    console.error('Error handling request:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};