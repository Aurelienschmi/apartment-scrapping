import { supabase } from './supabaseClient';

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