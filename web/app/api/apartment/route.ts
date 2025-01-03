import { supabase } from '../../../lib/supabaseClient';
import { NextResponse } from 'next/server';

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

export async function DELETE() {
  const { error } = await supabase
    .from('apartments')
    .delete()
    .neq('id', 0); // Exemple de condition pour supprimer tous les enregistrements sauf ceux avec id = 0

  if (error) {
    console.error('Error deleting data from Supabase:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'All records deleted' }, { status: 200 });
}