import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { crawlSite } from './crawler.js';
import { analyzeGaps } from './analyzer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/api/analyze', async (req, res) => {
  try {
    const { myUrl, competitorUrls, maxPages = 15, kymaApiKey } = req.body || {};
    
    if (!myUrl || !Array.isArray(competitorUrls) || competitorUrls.length === 0) {
      return res.status(400).json({ error: 'URL website của bạn và ít nhất 1 đối thủ là bắt buộc' });
    }
    
    console.log('--- Starting Gap Analysis ---');
    console.log(`Target: ${myUrl}`);
    console.log(`Competitors: ${competitorUrls.join(', ')}`);
    console.log(`Max Pages per site: ${maxPages}`);
    console.log(`Kyma API Key provided: ${kymaApiKey ? 'YES' : 'DEFAULT'}`);
    
    // Crawl all sites concurrently in parallel
    const [mySiteData, ...competitorResults] = await Promise.all([
      crawlSite(myUrl, maxPages),
      ...competitorUrls.map(url => crawlSite(url, maxPages))
    ]);

    const competitorData = competitorUrls.map((url, idx) => ({
      url,
      pages: competitorResults[idx] || []
    }));
    
    console.log('\n[AI] Running gap analysis...');
    const analysis = await analyzeGaps(mySiteData, competitorData, kymaApiKey);
    
    console.log('--- Gap Analysis Complete ---');
    res.json(analysis);
  } catch (error) {
    console.error('Analysis failed:', error);
    res.status(500).json({ error: 'Quá trình phân tích thất bại', details: error.message });
  }
});

// Serve Vite production build static assets if dist exists
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Content Gap Analysis server running on port ${PORT}`);
});
