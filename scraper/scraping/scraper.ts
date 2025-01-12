import puppeteer from 'puppeteer-extra';
import { getUrls } from './utils';
import chromium from '@sparticuz/chromium';



const EMAIL_MOTEUR_IMMO = process.env.MOTEUR_IMMO_EMAIL;
const PASSWORD_MOTEUR_IMMO = process.env.MOTEUR_IMMO_PASSWORD;

export async function scrapeLinksLilleImmo(url: string, linkSelector: string) {
  const browser = await puppeteer.launch({
    executablePath: await chromium.executablePath(),
    args: chromium.args,
    headless: chromium.headless,
  });
  const page = await browser.newPage();

  // Ajouter un en-tête HTTP
  await page.setExtraHTTPHeaders({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  });

  await page.goto(url);
  await page.waitForSelector(linkSelector);

  const links = await page.evaluate((linkSelector) => {
    return Array.from(document.querySelectorAll(linkSelector)).map((link) => (link as HTMLAnchorElement).href);
  }, linkSelector);

  await browser.close();
  return links;
}

export async function scrapeDynamicContentLilleImmo(url: string) {
  const browser = await puppeteer.launch({
    executablePath: await chromium.executablePath(),
    args: chromium.args,
    headless: chromium.headless,
  });
  const page = await browser.newPage();

  // Ajouter un en-tête HTTP
  await page.setExtraHTTPHeaders({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  });

  await page.goto(url);
  await page.waitForSelector("h1");

  const data = await page.evaluate((url) => {
    const cleanText = (text: string) => text.replace(/\s+/g, ' ').trim();

    const title = cleanText(document.querySelector("h1")?.textContent || "");
    const priceText = cleanText(document.querySelector("span.prix_item.pb-2")?.textContent || "").split('€')[0].trim();
    const price = parseFloat(priceText.replace(/\s/g, '').replace(',', '.'));
    const publication_date = new Date().toISOString();
    const l = cleanText(document.querySelector("span.text_location_item.flex.items-center.justify-start")?.textContent || "");
    const location = l.split(' ')[0].trim();
    const description = cleanText(document.querySelector("div.text__content.js_display_text_content")?.textContent || "");
    
    // Récupérer le nombre de pièces
    const roomElement = document.querySelector('h1.title_item span.second_line span.separator:nth-child(1)');
    const roomText = roomElement?.textContent?.trim() ?? "";
    const number_of_rooms = roomText.match(/\d+/)?.[0] ?? null;

    // Récupérer la surface
    const surfaceElement = document.querySelector('h1.title_item span.second_line span.separator:nth-child(3)');
    const surfaceText = surfaceElement?.textContent?.trim() ?? "";
    const surfaceMatch = surfaceText.match(/(\d+(\.\d+)?)/);
    const surface_area = surfaceMatch ? surfaceMatch[0] : null;
    
    //Gestion des boolean
    const is_shared = null;
    const has_garage = null;
    const is_furnished = null;
    const has_balcony = null;

    // Récupérer les images
    const images = Array.from(new Set(Array.from(document.querySelectorAll("img[data-src]")).map(img => {
        const src = img.getAttribute("data-src") || "";
        return src.startsWith("http") ? src : `https:${src}`;
    }))).slice(1); // Exclure la première image

    return { title, price, publication_date, location, description, images, url, number_of_rooms, surface_area, is_shared, has_garage, is_furnished, has_balcony };
  }, url);

  await browser.close();
  return data;
}

// scraping de moteurimmo
export async function scrapeContentsMoteurImmo(url: string) {
  const browser = await puppeteer.launch({
    executablePath: await chromium.executablePath(),
    args: chromium.args,
    headless: chromium.headless,
    protocolTimeout: 1800000 // Augmenter le délai d'attente à 1800000 ms (30 minutes)

  });

  const page = await browser.newPage();

  // Ajouter un en-tête HTTP
  await page.setExtraHTTPHeaders({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  });

  await page.goto(url, { waitUntil: 'networkidle2', timeout: 1800000 }); // Augmenter le délai d'attente à 1800000 ms (30 minutes)

  // aller sur la page de connexion et se connecter
  await page.waitForSelector('a[href="/connexion"]', { timeout: 1800000 });
  await page.click('a[href="/connexion"]');

  // remplir input email
  await page.waitForSelector('input[type="email"]', { timeout: 1800000 });
  if (EMAIL_MOTEUR_IMMO) {
    await page.type('input[type="email"]', EMAIL_MOTEUR_IMMO);
  } else {
    throw new Error('EMAIL_MOTEUR_IMMO is not defined');
  }
  if (PASSWORD_MOTEUR_IMMO) {
    await page.type('input[type="password"]', PASSWORD_MOTEUR_IMMO);
  } else {
    throw new Error('PASSWORD_MOTEUR_IMMO is not defined');
  }

  // cliquer sur le bouton de connexion
  await page.click('input[type="submit"].button.is-colored.is-medium[value="Connexion"]');

  await new Promise(r => setTimeout(r, 5000));

  //retour à la page d'accueil
  await page.waitForSelector('a[href="/"]', { timeout: 1800000 });
  await page.click('a[href="/"]');

  // Remplir le formulaire de recherche
  await page.waitForSelector('.toggle-switch .toggle-button-2:not([disabled])', { timeout: 1800000 });
  const buttons = await page.$$('.toggle-switch .toggle-button-2:not([disabled])');
  for (const button of buttons) {
    const text = await page.evaluate(el => el.textContent, button);
    if (text && text.includes('Location')) {
      await button.click();
      break;
    }
  }

  // Remplir le formulaire de recherche
  await page.type('#property-location', 'lille');
  await page.keyboard.press('Enter');

  await page.type('#location-radius', '10');

  await page.waitForSelector('.search-submit-button .action-button input[type="submit"][value="Lancer la recherche"]', { timeout: 1800000 });
  // Cliquer sur le bouton "Lancer la recherche"
  await page.click('.search-submit-button .action-button input[type="submit"][value="Lancer la recherche"]');

  //attendre 5sec et reprendre un screenshot
  await new Promise(r => setTimeout(r, 5000));

  console.log('Avant page.evaluate');

  // Récupérer les URLs de la base de données
  const urls = await getUrls();
  if (!Array.isArray(urls)) {
    throw new Error('Failed to fetch URLs');
  }

  // Créer la liste scrapedUrls
  const scrapedUrlsArray = Array.from(new Set(urls));

  // Récupérer les informations des annonces
  const annonces = await page.evaluate(async (scrapedUrlsArray) => {
    const scrapedUrls = new Set(scrapedUrlsArray); // Reconstruire l'ensemble à partir du tableau
    const annoncesData: { title: string | null; price: string | null; publication_date: string | null; location: string | null; description: string | null; url: string | null; images: string[]; surface_area: string | null; number_of_rooms: string | null; is_shared: boolean; has_garage: boolean; is_furnished: boolean; has_balcony: boolean }[] = []; 
    let previousHeight = 0;
    console.log('Scraping annonces avant...');

    while (annoncesData.length < 5) {
      const annonceElements = document.querySelectorAll('.column.is-half');
      for (const annonce of annonceElements) {
        if (annoncesData.length >= 5) break;

        const urlElement = annonce.querySelector('a.property-top-title');
        const url = urlElement?.getAttribute('href') ?? null;

        if (url && scrapedUrls.has(url)) {
          console.log(`URL déjà présente dans la base de données: ${url}`);
          continue;
        }

        const titleElement = annonce.querySelector('a.property-top-title');
        const priceElement = annonce.querySelector('span svg[data-icon="money-bill-wave"]');
        const publicatedElement = annonce.querySelector('span.property-creation-date-tag b');
        const locationElement = annonce.querySelector('span svg[data-icon="map-location-dot"] + br + a span.city');
        const descriptionElement = annonce.querySelector('.property-description div');
        const surfaceElement = annonce.querySelector('span svg[data-icon="up-right-and-down-left-from-center"] + br + span');
        const roomElement = annonce.querySelector('span svg[data-icon="bed"] + br + p');
        const colocationElement = annonce.querySelector('span.tag svg[data-icon="users"]');
        const garageElement = annonce.querySelector('span.tag svg[data-icon="car"]');
        const furnitureElement = annonce.querySelector('span.tag svg[data-icon="couch"]');
        const balconyElement = annonce.querySelector('span.tag svg[data-icon="sun"]');

        const title = titleElement?.textContent?.trim() ?? null;
        const p = priceElement?.parentElement?.innerText.split('\n')[1]?.trim() ?? null;
        const price = p?.split('€')[0]?.replace(/\s/g, '').replace(',', '.') ?? null;
        const publicated = publicatedElement?.textContent?.trim() ?? null;
        const location = locationElement?.textContent?.trim().split(' ')[0] ?? null;
        const description = descriptionElement?.textContent?.trim() ?? null;
        const s = surfaceElement?.textContent?.trim() ?? null;
        const surface_area = s?.split(' ')[0]?.trim() ?? null;
        const roomText = roomElement?.textContent?.trim() ?? null;
        const number_of_rooms = roomText ? roomText.match(/\d+/)?.[0] ?? null : null;
        const is_shared = colocationElement ? true : false;
        const has_garage = garageElement ? true : false;
        const is_furnished = furnitureElement ? true : false;
        const has_balcony = balconyElement ? true : false;

        // Formater la date de publication
        let publication_date = null;
        if (publicated) {
          const [datePart, timePart] = publicated.split(' à ');
          const [day, month, year] = datePart.split('/');
          const [hours, minutes] = timePart.split(':');
          const formattedDate = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes)));
          publication_date = formattedDate.toISOString();
        }

        // Récupérer le nombre d'images
        const imagesCountElement = annonce.querySelector('.property-right-corner span.tag');
        let imagesCount = 0;
        if (imagesCountElement && imagesCountElement.textContent) {
          const imagesCountText = imagesCountElement.textContent.trim();
          console.log('imagesCountElement:', imagesCountText);
          imagesCount = parseInt(imagesCountText);
        } else {
          console.log('imagesCountElement not found or textContent is null');
        }

        // Récupérer les URLs des images
        const images: string[] = [];
        if (imagesCount > 0) {
          const firstImageElement = annonce.querySelector('a img.carousel-image');
          if (firstImageElement) {
            const firstImageUrl = firstImageElement.getAttribute('src');
            if (firstImageUrl) {
              images.push(firstImageUrl);
            }
          }
        }

        // Vérifier que les informations ne sont pas vides avant de les ajouter
        if (title && price && location && description && url && surface_area && number_of_rooms) {
          annoncesData.push({ title, price, publication_date, location, description, url, images, surface_area, number_of_rooms, is_shared, has_garage, is_furnished, has_balcony });
          scrapedUrls.add(url); // Ajouter l'URL à l'ensemble des URLs scrappées
        } else {
          // Descendre la page et revenir à la div actuelle
          window.scrollBy(0, window.innerHeight);
          await new Promise(r => setTimeout(r, 2000)); // Attendre que la page charge plus de contenu
          window.scrollTo(0, (annonce as HTMLElement).offsetTop); // Revenir à la div actuelle
        }
      }

      const currentHeight = document.body.scrollHeight;
      if (currentHeight === previousHeight) break; // Arrêter si la page ne défile plus
      previousHeight = currentHeight;
    }

    return annoncesData;
  }, scrapedUrlsArray);

  await browser.close();
  return annonces;
}