import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

// Abort fetch after timeoutMs (3 seconds) to prevent hanging sites from blocking
async function fetchHtml(url, timeoutMs = 3000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 ContentGapBot/1.0'
      }
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    return await res.text();
  } catch (err) {
    clearTimeout(timeout);
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

function parsePageHtml(url, html, domain) {
  if (!html) return null;
  try {
    const $ = cheerio.load(html);
    
    const title = $('title').text().trim();
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    const h1 = $('h1').first().text().trim();
    
    const headings = [];
    $('h2, h3').each((i, el) => {
      const text = $(el).text().trim();
      if (text) headings.push(text);
    });
    
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
    const wordCount = bodyText.split(' ').length;
    
    let internalLinks = 0;
    const discoveredUrls = [];
    $('a').each((i, el) => {
      const href = $(el).attr('href');
      if (href) {
        try {
          const absoluteUrl = new URL(href, url).toString();
          if (extractDomain(absoluteUrl) === domain) {
            internalLinks++;
            discoveredUrls.push(absoluteUrl);
          }
        } catch (e) {
          // ignore
        }
      }
    });
    
    const images = $('img').length;
    const hasVideo = $('iframe[src*="youtube.com"], iframe[src*="vimeo.com"], video').length > 0;
    
    return {
      page: {
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
      },
      discoveredUrls
    };
  } catch (e) {
    return null;
  }
}

export async function crawlSite(baseUrl, maxPages = 15) {
  console.log(`Starting fast crawl for ${baseUrl} (max ${maxPages} pages)`);
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
    const sitemapText = await fetchHtml(sitemapUrl, 2500);
    
    if (sitemapText && sitemapText.includes('<url>')) {
      const $ = cheerio.load(sitemapText, { xmlMode: true });
      $('loc').each((i, el) => {
        const url = $(el).text().trim();
        if (extractDomain(url) === domain && !queue.includes(url)) {
          queue.push(url);
        }
      });
      console.log(`Found ${queue.length - 1} URLs in sitemap`);
    }
  } catch (err) {
    console.log('Sitemap check skipped or failed.');
  }

  // Fast Batch Crawling (5 concurrent requests at a time)
  const batchSize = 5;

  while (queue.length > 0 && pages.length < maxPages) {
    const batch = [];
    while (queue.length > 0 && batch.length < batchSize && (pages.length + batch.length) < maxPages) {
      const nextUrl = queue.shift();
      if (!visited.has(nextUrl)) {
        visited.add(nextUrl);
        batch.push(nextUrl);
      }
    }

    if (batch.length === 0) break;

    // Fetch batch in parallel
    const results = await Promise.all(
      batch.map(async (url) => {
        const html = await fetchHtml(url, 3000);
        return parsePageHtml(url, html, domain);
      })
    );

    for (const res of results) {
      if (res && res.page) {
        pages.push(res.page);
        for (const disc of res.discoveredUrls) {
          if (!visited.has(disc) && !queue.includes(disc)) {
            queue.push(disc);
          }
        }
      }
    }
  }
  
  console.log(`Finished crawling ${baseUrl}: ${pages.length} pages scraped.`);
  return pages;
}
