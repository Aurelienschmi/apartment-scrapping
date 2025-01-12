import { scrapeLinksLilleImmo, scrapeDynamicContentLilleImmo, scrapeContentsMoteurImmo } from "../../../lib/scraper";
import { supabase } from "../../../lib/supabaseClient";
import { NextResponse } from "next/server";

const urlsToScrape = [
  {
    url: "https://www.live-immo.com/location/1",
    linkSelector: ".card_bien__link.flex.justify-start.items-start.md\\:items-center.flex-wrap.flex-col.md\\:flex-row",
    scrapeLinks: scrapeLinksLilleImmo,
    scrapeContent: scrapeDynamicContentLilleImmo
  },
  {
    url: "https://moteurimmo.fr/",
    scrapeContent: scrapeContentsMoteurImmo
  }
];

export async function GET() {
  try {
    const allData = [];

    for (const site of urlsToScrape) {
      let links = [site.url]; // Default to the site's URL if no links need to be scraped

      if (site.scrapeLinks) {
        links = await site.scrapeLinks(site.url, site.linkSelector);

        // Vérifier les URLs déjà présentes dans la base de données
        const { data: existingUrls, error } = await supabase
          .from('apartments')
          .select('url')
          .in('url', links);

        if (error) {
          console.error('Error fetching existing URLs from Supabase:', error);
          return NextResponse.json({ error: error.message, details: error.details, hint: error.hint }, { status: 500 });
        }

        // Filtrer les URLs déjà présentes
        const existingUrlsSet = new Set(existingUrls.map(item => item.url));
        links = links.filter(link => !existingUrlsSet.has(link));
      }

      for (const link of links) {
        const data = await site.scrapeContent(link);

        // Si la fonction scrapeContent retourne un tableau d'annonces
        if (Array.isArray(data)) {
          // Récupérer les URLs des annonces déjà présentes dans la base de données
          const annonceUrls = data.map(annonce => annonce.url);
          const { data: existingAnnonceUrls, error: annonceError } = await supabase
            .from('apartments')
            .select('url')
            .in('url', annonceUrls);

          if (annonceError) {
            console.error('Error fetching existing annonce URLs from Supabase:', annonceError);
            return NextResponse.json({ error: annonceError.message, details: annonceError.details, hint: annonceError.hint }, { status: 500 });
          }

          // Filtrer les annonces déjà présentes
          const existingAnnonceUrlsSet = new Set(existingAnnonceUrls.map(item => item.url));
          const newAnnonces = data.filter(annonce => !existingAnnonceUrlsSet.has(annonce.url));

          for (const annonce of newAnnonces) {
            const formattedData = {
              title: annonce.title || null,
              price: annonce.price || null,
              publication_date: annonce.publication_date || null,
              location: annonce.location || null,
              description: annonce.description || null,
              images: annonce.images.length > 0 ? annonce.images : [],
              url: annonce.url || null,
              number_of_rooms: annonce.number_of_rooms || null,
              surface_area: annonce.surface_area || null,
              is_shared: annonce.is_shared !== undefined ? annonce.is_shared : null,
              has_garage: annonce.has_garage !== undefined ? annonce.has_garage : null,
              is_furnished: annonce.is_furnished !== undefined ? annonce.is_furnished : null,
              has_balcony: annonce.has_balcony !== undefined ? annonce.has_balcony : null
            };

            allData.push(formattedData);

            // Envoyer les données à Supabase
            const { data: insertedData, error } = await supabase
              .from('apartments')
              .insert([formattedData]);

            if (error) {
              console.error('Error inserting data into Supabase:', error);
              console.error('Error details:', error.details);
              console.error('Error hint:', error.hint);
              console.error('Data:', JSON.stringify(formattedData, null, 2)); // Log the data being inserted
              return NextResponse.json({ error: error.message, details: error.details, hint: error.hint }, { status: 500 });
            } else {
              console.log('Data inserted into Supabase:', insertedData);
            }
          }
        } else {
          // Si la fonction scrapeContent retourne une seule annonce
          const formattedData = {
            title: data.title || null,
            price: data.price || null,
            publication_date: data.publication_date || null,
            location: data.location || null,
            description: data.description || null,
            images: data.images.length > 0 ? data.images : [],
            url: data.url || null,
            number_of_rooms: data.number_of_rooms || null,
            surface_area: data.surface_area || null,
            is_shared: data.is_shared !== undefined ? data.is_shared : null,
            has_garage: data.has_garage !== undefined ? data.has_garage : null,
            is_furnished: data.is_furnished !== undefined ? data.is_furnished : null,
            has_balcony: data.has_balcony !== undefined ? data.has_balcony : null
          };

          allData.push(formattedData);

          // Envoyer les données à Supabase
          const { data: insertedData, error } = await supabase
            .from('apartments')
            .insert([formattedData]);

          if (error) {
            console.error('Error inserting data into Supabase:', error);
            console.error('Error details:', error.details);
            console.error('Error hint:', error.hint);
            console.error('Data:', JSON.stringify(formattedData, null, 2)); // Log the data being inserted
            return NextResponse.json({ error: error.message, details: error.details, hint: error.hint }, { status: 500 });
          } else {
            console.log('Data inserted into Supabase:', insertedData);
          }
        }
      }
    }

    return NextResponse.json(allData);
  } catch (error) {
    console.error("Scraping error:", error);
    return NextResponse.json({ error: "Scraping failed", details: (error as Error).message }, { status: 500 });
  }
}