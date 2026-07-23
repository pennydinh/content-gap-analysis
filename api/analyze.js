import { crawlSite } from '../server/crawler.js';
import { analyzeGaps } from '../server/analyzer.js';

export const maxDuration = 60; // Vercel function max duration

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { myUrl, competitorUrls, maxPages = 15, kymaApiKey } = req.body || {};
    
    if (!myUrl || !Array.isArray(competitorUrls) || competitorUrls.length === 0) {
      return res.status(400).json({ error: 'URL website của bạn và ít nhất 1 đối thủ là bắt buộc' });
    }

    console.log('--- Starting Fast Gap Analysis ---');
    console.log(`Target: ${myUrl}`);
    console.log(`Competitors: ${competitorUrls.join(', ')}`);
    console.log(`Max Pages: ${maxPages}`);

    // Crawl target site + all competitor sites concurrently in parallel
    const [mySiteData, ...competitorResults] = await Promise.all([
      crawlSite(myUrl, maxPages),
      ...competitorUrls.map(url => crawlSite(url, maxPages))
    ]);

    const competitorData = competitorUrls.map((url, idx) => ({
      url,
      pages: competitorResults[idx] || []
    }));

    console.log('[AI] Running AI gap analysis...');
    const analysis = await analyzeGaps(mySiteData, competitorData, kymaApiKey);
    
    console.log('--- Analysis Complete ---');
    res.status(200).json(analysis);
  } catch (error) {
    console.error('Vercel function error:', error);
    res.status(500).json({ error: 'Quá trình phân tích thất bại', details: error.message });
  }
}
