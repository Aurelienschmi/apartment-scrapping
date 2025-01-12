import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    const userId = decoded.user_id;
    console.log('User ID:', userId);    

    const { apartmentId } = await req.json();

    // Ensure apartmentId is treated as an integer
    const apartmentIdInt = parseInt(apartmentId, 10);

    if (isNaN(apartmentIdInt)) {
      return NextResponse.json({ error: 'Invalid apartment ID' }, { status: 400 });
    }

    // Check if the apartment is already liked by the user
    const { data: existingLike, error: existingLikeError } = await supabase
      .from('user_favorites')
      .select('*')
      .eq('apartment_id', apartmentIdInt)
      .eq('user_id', userId)
      .maybeSingle();

    if (existingLikeError && existingLikeError.code !== 'PGRST116') {
      console.error('Error checking existing like:', existingLikeError);
      return NextResponse.json({ error: 'Failed to check existing like' }, { status: 500 });
    }

    if (existingLike) {
      // If already liked, remove the like
      const { error: deleteError } = await supabase
        .from('user_favorites')
        .delete()
        .eq('id', existingLike.id);

      if (deleteError) {
        console.error('Error removing like:', deleteError);
        return NextResponse.json({ error: 'Failed to remove like' }, { status: 500 });
      }

      return NextResponse.json({ message: 'Apartment unliked successfully' }, { status: 200 });
    } else {
      // If not liked, add the like
      const { error: insertError } = await supabase
        .from('user_favorites')
        .insert([{ apartment_id: apartmentIdInt, user_id: userId }]);

      if (insertError) {
        console.error('Error liking apartment:', insertError);
        return NextResponse.json({ error: 'Failed to like apartment' }, { status: 500 });
      }

      return NextResponse.json({ message: 'Apartment liked successfully' }, { status: 200 });
    }
  } catch (error) {
    console.error('Error handling request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function handler(req: NextRequest) {
  if (req.method === 'POST') {
    return POST(req);
  } else {
    return NextResponse.json({ error: `Method ${req.method} Not Allowed` }, { status: 405 });
  }
}