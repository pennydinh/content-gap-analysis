import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function fetchHtml(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 ContentGapBot/1.0'
      }
    });
    if (!res.ok) return null;
    return await res.text();
  } catch (err) {
    console.error(`Failed to fetch ${url}:`, err.message);
    return null;
  }
}

function extractDomain(urlStr) {
  try {
    const u = new URL(urlStr);
    return u.hostname;
  } catch (e) {
    return null;
  }
}

export async function crawlSite(baseUrl, maxPages) {
  console.log(`Starting crawl for ${baseUrl} (max ${maxPages} pages)`);
  const domain = extractDomain(baseUrl);
  if (!domain) {
    throw new Error('Invalid URL');
  }

  const pages = [];
  const visited = new Set();
  const queue = [baseUrl];

  // Try sitemap.xml first
  try {
    const sitemapUrl = new URL('/sitemap.xml', baseUrl).toString();
    console.log(`Checking sitemap at ${sitemapUrl}`);
    const sitemapText = await fetchHtml(sitemapUrl);
    
    if (sitemapText && sitemapText.includes('<url>')) {
      const $ = cheerio.load(sitemapText, { xmlMode: true });
      $('loc').each((i, el) => {
        const url = $(el).text();
        if (extractDomain(url) === domain && !queue.includes(url)) {
          queue.push(url);
        }
      });
      console.log(`Found ${queue.length - 1} URLs in sitemap`);
    }
  } catch (err) {
    console.log('Sitemap not found or unparseable, falling back to basic crawl.');
  }

  let count = 0;
  
  while (queue.length > 0 && count < maxPages) {
    const url = queue.shift();
    if (visited.has(url)) continue;
    visited.add(url);
    
    count++;
    console.log(`Crawling page ${count}/${maxPages}: ${url}`);
    
    await delay(500); // Polite delay
    
    const html = await fetchHtml(url);
    if (!html) continue;
    
    const $ = cheerio.load(html);
    
    const title = $('title').text().trim();
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    const h1 = $('h1').text().trim();
    
    const headings = [];
    $('h2, h3').each((i, el) => {
      headings.push($(el).text().trim());
    });
    
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
    const wordCount = bodyText.split(' ').length;
    
    let internalLinks = 0;
    $('a').each((i, el) => {
      const href = $(el).attr('href');
      if (href) {
        try {
          const absoluteUrl = new URL(href, url).toString();
          if (extractDomain(absoluteUrl) === domain) {
            internalLinks++;
            if (!visited.has(absoluteUrl) && !queue.includes(absoluteUrl)) {
              queue.push(absoluteUrl);
            }
          }
        } catch (e) {
          // ignore invalid URLs
        }
      }
    });
    
    const images = $('img').length;
    const hasVideo = $('iframe[src*="youtube.com"], iframe[src*="vimeo.com"], video').length > 0;
    
    pages.push({
      url,
      title,
      metaDescription,
      h1,
      headings,
      bodyText,
      wordCount,
      internalLinks,
      images,
      hasVideo
    });
  }
  
  console.log(`Finished crawling ${baseUrl}: ${pages.length} pages scraped.`);
  return pages;
}
