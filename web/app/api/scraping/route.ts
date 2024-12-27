import { scrapeLinks, scrapeDynamicContentLilleImmo } from "../../../lib/scraper";
import { supabase } from "../../../lib/supabaseClient";
import { NextResponse } from "next/server";

const urlsToScrape = [
  "https://www.live-immo.com/location/1",
];

export async function GET() {
  try {
    const allData = [];

    for (const url of urlsToScrape) {
      const links = await scrapeLinks(url, ".card_bien__link.flex.justify-start.items-start.md\\:items-center.flex-wrap.flex-col.md\\:flex-row");

      for (const link of links) {
        const data = await scrapeDynamicContentLilleImmo(link);
        allData.push(data);
        
        const { data: insertedData, error } = await supabase
          .from('apartments')
          .insert([data]);

        if (error) {
          console.error('Error inserting data into Supabase:', error);
          console.error('Error details:', error.details);
          console.error('Error hint:', error.hint);
          console.error('Data:', JSON.stringify(data, null, 2));
          return NextResponse.json({ error: error.message, details: error.details, hint: error.hint }, { status: 500 });
        } else {
          console.log('Data inserted into Supabase:', insertedData);
        }
      }
    }

    return NextResponse.json(allData);
  } catch (error) {
    console.error("Scraping error:", error);
    return NextResponse.json({ error: "Scraping failed", details: (error as Error).message }, { status: 500 });
  }
}