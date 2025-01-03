// filepath: /home/aurel/Documents/Work/appartment-scrapping/web/app/api/apartment/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';

export async function GET() {
  const { data, error } = await supabase
    .from('apartments')
    .select('*');

  if (error) {
    console.error('Error fetching data from Supabase:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

// fonction GET pour recuperer tout les urls
export async function getUrls() {
  const { data, error } = await supabase
    .from('apartments')
    .select('url');

    if (error) {
      console.error('Error fetching data from Supabase:', error);
      throw new Error('Failed to fetch URLs');
    }
  
    return data.map(item => item.url);
  }

export async function DELETE() {
  const { error } = await supabase
    .from('apartments')
    .delete()
    .neq('id', 0); // Utilisez une condition valide pour supprimer toutes les lignes

  if (error) {
    console.error('Error deleting data from Supabase:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'All data deleted successfully' }, { status: 200 });
}