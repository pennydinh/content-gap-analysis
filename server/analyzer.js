// ============================================================
// AI-powered Content Gap Analyzer using Kyma LLM API
// Sends crawled content to LLM for intelligent analysis
// ============================================================

const DEFAULT_KYMA_KEY = 'kyma-361d690a1ed1c6a19a0ea0402ba9377dd8eda671ece6733b';
const KYMA_BASE_URL = 'https://kymaapi.com/v1';
const MODEL = 'qwen-3-coder'; // fast, cheap, great at structured output

async function callLLM(systemPrompt, userPrompt, apiKey) {
  const keyToUse = apiKey && apiKey.trim() ? apiKey.trim() : DEFAULT_KYMA_KEY;

  const res = await fetch(`${KYMA_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${keyToUse}`
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 8000,
      response_format: { type: 'json_object' }
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Kyma API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content || '{}';

  let cleaned = content.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  return JSON.parse(cleaned);
}

// Summarize pages into compact form for LLM context (max 25 pages per site to prevent context blowup)
function summarizePages(pages) {
  const sampled = pages.slice(0, 30); // Take up to 30 pages
  return sampled.map(p => ({
    url: p.url,
    title: p.title || '(no title)',
    h1: p.h1 || '',
    headings: (p.headings || []).slice(0, 6),
    metaDescription: (p.metaDescription || '').slice(0, 150),
    wordCount: p.wordCount,
    hasVideo: p.hasVideo,
    snippet: (p.bodyText || '').slice(0, 350)
  }));
}

export async function analyzeGaps(mySiteData, competitorData, kymaApiKey) {
  const myUrl = mySiteData.length > 0 ? new URL(mySiteData[0].url).origin : 'unknown';

  const mySummary = summarizePages(mySiteData);
  const compSummaries = competitorData.map(c => ({
    url: c.url,
    pages: summarizePages(c.pages)
  }));

  // --- Step 1: Ask LLM to analyze keyword & topic gaps ---
  console.log('  → [AI] Analyzing keywords & topics with LLM...');

  const keywordTopicResult = await callLLM(
    `Bạn là chuyên gia SEO phân tích content gap. Bạn sẽ nhận dữ liệu crawl từ website chính và các đối thủ cạnh tranh.
Nhiệm vụ: Phân tích nội dung và tìm ra keyword gaps, topic gaps.

QUAN TRỌNG:
- Keyword phải là cụm từ có nghĩa (2-4 từ), KHÔNG phải từ đơn lẻ. Ví dụ: "ống nhựa HDPE", "bảng giá ống nước", KHÔNG phải "ống", "nhựa"
- Phân tích dựa trên tiêu đề, heading, meta description và nội dung
- Priority: "high" = đối thủ có nhiều, search intent rõ; "medium" = có ở 1-2 đối thủ; "low" = ít quan trọng
- Trả về JSON format chính xác`,

    `WEBSITE CHÍNH (${myUrl}):
${JSON.stringify(mySummary, null, 1)}

ĐỐI THỦ CẠNH TRANH:
${JSON.stringify(compSummaries, null, 1)}

Trả về JSON:
{
  "keywordGaps": [
    { "keyword": "cụm từ khóa 2-4 từ", "frequency": <số lần xuất hiện ở đối thủ>, "foundIn": ["url đối thủ"], "priority": "high|medium|low", "reason": "lý do ngắn" }
  ],
  "topicGaps": [
    { "topic": "chủ đề", "myCount": <số bài của bạn>, "competitors": {"url": <số bài>}, "hasGap": true/false, "suggestion": "gợi ý nội dung" }
  ]
}

Tìm 15-30 keyword gaps và 8-15 topic gaps. Ưu tiên các keyword/topic có giá trị SEO cao.`,
    kymaApiKey
  );

  // --- Step 2: Ask LLM to analyze formats & create priority list ---
  console.log('  → [AI] Analyzing content formats & priorities...');

  const formatPriorityResult = await callLLM(
    `Bạn là chuyên gia content strategy. Phân tích content format và tạo danh sách ưu tiên.

Format types hợp lệ: "bảng giá", "hướng dẫn", "so sánh", "đánh giá", "FAQ", "tin tức", "sản phẩm", "giới thiệu", "case study", "listicle", "video", "công cụ", "long-form", "liên hệ", "trang chuẩn"

Priority levels: P0 (làm ngay), P1 (quý này), P2 (6 tháng), P3 (theo dõi)`,

    `WEBSITE CHÍNH (${myUrl}):
${JSON.stringify(mySummary, null, 1)}

ĐỐI THỦ:
${JSON.stringify(compSummaries, null, 1)}

Trả về JSON:
{
  "formatGaps": {
    "myFormats": { "tên format": <số lượng> },
    "competitorFormats": { "url đối thủ": { "tên format": <số lượng> } }
  },
  "priorityList": [
    { "title": "Tiêu đề bài viết gợi ý bằng tiếng Việt", "keyword": "keyword mục tiêu", "priority": "P0|P1|P2|P3", "effort": "low|medium|high", "impact": "low|medium|high", "type": "keyword|topic|format", "reason": "lý do ngắn" }
  ],
  "calendar": [
    { "week": 1, "month": 1, "title": "Tiêu đề nội dung", "type": "loại bài", "targetKeyword": "keyword", "priority": "P0" }
  ]
}

Tạo 10-20 priority items và content calendar 12 tuần (3 tháng).`,
    kymaApiKey
  );

  // --- Merge Results ---
  console.log('  → Merging AI analysis results...');

  const keywordGaps = keywordTopicResult.keywordGaps || [];
  const topicGaps = keywordTopicResult.topicGaps || [];
  const formatGaps = formatPriorityResult.formatGaps || { myFormats: {}, competitorFormats: {} };
  const priorityList = formatPriorityResult.priorityList || [];
  const calendar = formatPriorityResult.calendar || [];

  const priorityOrder = { high: 0, medium: 1, low: 2 };
  keywordGaps.sort((a, b) => (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2));

  const pOrder = { P0: 0, P1: 1, P2: 2, P3: 3 };
  priorityList.sort((a, b) => (pOrder[a.priority] || 3) - (pOrder[b.priority] || 3));

  return {
    mySite: {
      url: myUrl,
      pages: mySiteData.map(p => ({ url: p.url, title: p.title, wordCount: p.wordCount })),
      totalPages: mySiteData.length,
      avgWordCount: Math.round(mySiteData.reduce((acc, p) => acc + p.wordCount, 0) / (mySiteData.length || 1))
    },
    competitors: competitorData.map(comp => ({
      url: comp.url,
      pages: comp.pages.map(p => ({ url: p.url, title: p.title, wordCount: p.wordCount })),
      totalPages: comp.pages.length,
      avgWordCount: Math.round(comp.pages.reduce((acc, p) => acc + p.wordCount, 0) / (comp.pages.length || 1))
    })),
    keywordGaps,
    topicGaps,
    formatGaps,
    priorityList,
    calendar
  };
}
