import puppeteer from "puppeteer";

export async function scrapeLinks(url: string, linkSelector: string) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
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
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto(url);

  await page.waitForSelector("h1");

  const data = await page.evaluate((url) => {
    const cleanText = (text: string) => text.replace(/\s+/g, ' ').trim();

    const title = cleanText(document.querySelector("h1")?.textContent || "");
    const priceText = cleanText(document.querySelector("span.prix_item.pb-2")?.textContent || "").split('€')[0].trim();
    const price = parseFloat(priceText.replace(/\s/g, '').replace(',', '.'));
    const location = cleanText(document.querySelector("span.text_location_item.flex.items-center.justify-start")?.textContent || "");
    const description = cleanText(document.querySelector("div.text__content.js_display_text_content")?.textContent || "");
    const images = Array.from(new Set(Array.from(document.querySelectorAll("img[data-src]")).map(img => {
      const src = img.getAttribute("data-src") || "";
      return src.startsWith("http") ? src : `https:${src}`;
    })));

    return { title, price, location, description, images, url };
  }, url);

  await browser.close();
  return data;
}