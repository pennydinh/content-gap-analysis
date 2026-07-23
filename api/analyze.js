import { crawlSite } from '../server/crawler.js';
import { analyzeGaps } from '../server/analyzer.js';

export const maxDuration = 60; // Set Vercel function max duration to 60s

export default async function handler(req, res) {
  // Set CORS headers
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
    const { myUrl, competitorUrls, maxPages = 10, kymaApiKey } = req.body || {};
    
    if (!myUrl || !Array.isArray(competitorUrls)) {
      return res.status(400).json({ error: 'myUrl (string) và competitorUrls (array) là bắt buộc' });
    }

    console.log('--- Starting Vercel Gap Analysis ---');
    console.log(`Target: ${myUrl}`);
    console.log(`Competitors: ${competitorUrls.join(', ')}`);
    console.log(`Max Pages: ${maxPages}`);
    
    console.log('[1] Crawling target site...');
    const mySiteData = await crawlSite(myUrl, maxPages);
    
    const competitorData = [];
    for (let i = 0; i < competitorUrls.length; i++) {
      console.log(`[2.${i+1}] Crawling competitor: ${competitorUrls[i]}`);
      const pages = await crawlSite(competitorUrls[i], maxPages);
      competitorData.push({
        url: competitorUrls[i],
        pages
      });
    }
    
    console.log('[3] Running AI gap analysis...');
    const analysis = await analyzeGaps(mySiteData, competitorData, kymaApiKey);
    
    console.log('--- Analysis Complete ---');
    res.status(200).json(analysis);
  } catch (error) {
    console.error('Vercel function error:', error);
    res.status(500).json({ error: 'Quá trình phân tích thất bại', details: error.message });
  }
}
