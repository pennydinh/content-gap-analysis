// ============================================================
// Vietnamese-aware NLP utilities for Content Gap Analysis
// Uses N-grams (bigrams/trigrams) instead of single-word tokens
// ============================================================

// Comprehensive Vietnamese single-syllable stop words
// These are meaningless when alone but form real words in combinations
export const VI_STOP_SYLLABLES = new Set([
  // Function words
  'và', 'của', 'là', 'có', 'không', 'được', 'cho', 'các', 'một', 'này',
  'đó', 'từ', 'như', 'nhưng', 'đến', 'để', 'với', 'trong', 'những', 'về',
  'khi', 'ra', 'ở', 'đã', 'còn', 'theo', 'sẽ', 'lại', 'lên', 'cũng',
  'nhiều', 'chỉ', 'rất', 'vào', 'bởi', 'sau', 'nào', 'ai', 'gì', 'tại',
  'thì', 'làm', 'đang', 'nên', 'hay', 'mà', 'hoặc', 'vì', 'nếu', 'bị',
  'do', 'trên', 'dưới', 'giữa', 'qua', 'trước', 'ngay', 'cùng', 'đều',
  'mỗi', 'vẫn', 'hơn', 'nhất', 'bạn', 'chúng', 'tôi', 'họ', 'ta',
  'mình', 'anh', 'chị', 'em', 'ông', 'bà', 'thế', 'rồi', 'mới', 'đây',
  'kia', 'ấy', 'nữa', 'cả', 'đi', 'lấy', 'nay', 'hết', 'luôn', 'phải',
  'chưa', 'bao', 'giờ', 'sao', 'thôi', 'nha', 'nhé', 'ạ', 'dạ', 'vâng',
  'ừ', 'ơi', 'hả', 'chứ', 'mà', 'thì', 'xem', 'xin', 'vui', 'lòng',
  // Web/UI noise
  'home', 'menu', 'click', 'here', 'read', 'more', 'share', 'like',
  'comment', 'reply', 'search', 'page', 'next', 'prev', 'back', 'close',
  'submit', 'send', 'email', 'phone', 'address', 'copyright', 'reserved',
  'loading', 'error', 'success', 'skip', 'content', 'navigation',
  'trang', 'chủ', 'liên', 'hệ', 'đăng', 'nhập', 'ký', 'thoát',
  'đọc', 'thêm', 'xem', 'chi', 'tiết', 'danh', 'mục',
]);

export const EN_STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and',
  'any', 'are', 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below',
  'between', 'both', 'but', 'by', 'can', 'could', 'did', 'do', 'does', 'doing',
  'down', 'during', 'each', 'few', 'for', 'from', 'further', 'get', 'got', 'had',
  'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him',
  'himself', 'his', 'how', 'if', 'in', 'into', 'is', 'it', 'its', 'itself',
  'just', 'know', 'let', 'like', 'make', 'me', 'might', 'more', 'most', 'must',
  'my', 'myself', 'no', 'nor', 'not', 'now', 'of', 'off', 'on', 'once', 'only',
  'or', 'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same',
  'she', 'should', 'so', 'some', 'such', 'than', 'that', 'the', 'their',
  'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 'this',
  'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'we',
  'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why',
  'will', 'with', 'would', 'you', 'your', 'yours', 'yourself', 'yourselves',
]);

// Clean text: remove HTML entities, extra whitespace, punctuation noise
function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/<[^>]+>/g, ' ')           // Remove any leftover HTML
    .replace(/&[a-z]+;/gi, ' ')         // Remove HTML entities
    .replace(/https?:\/\/\S+/g, ' ')    // Remove URLs
    .replace(/[0-9]{5,}/g, ' ')         // Remove long numbers (phone numbers, etc.)
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()'"\[\]\\|@+<>]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

// Split text into syllables (basic Vietnamese "words")
function splitSyllables(text) {
  const cleaned = cleanText(text);
  return cleaned.split(/\s+/).filter(w => w.length >= 2);
}

// Generate N-grams (bigrams and trigrams) from syllable array
function generateNgrams(syllables, minN = 2, maxN = 3) {
  const ngrams = [];

  for (let n = minN; n <= maxN; n++) {
    for (let i = 0; i <= syllables.length - n; i++) {
      const gram = syllables.slice(i, i + n).join(' ');
      // Filter: skip if all parts are stop words
      const parts = gram.split(' ');
      const meaningfulParts = parts.filter(p => !VI_STOP_SYLLABLES.has(p) && !EN_STOP_WORDS.has(p));
      if (meaningfulParts.length >= Math.ceil(parts.length / 2)) {
        ngrams.push(gram);
      }
    }
  }

  return ngrams;
}

// Extract meaningful keyword phrases from text
export function extractKeywords(text, topN = 30) {
  const syllables = splitSyllables(text);
  const ngrams = generateNgrams(syllables, 2, 4);

  // Count frequency
  const freq = new Map();
  for (const gram of ngrams) {
    freq.set(gram, (freq.get(gram) || 0) + 1);
  }

  // Filter: keep only phrases appearing 2+ times, or appearing once with 3+ syllables
  const filtered = [];
  for (const [phrase, count] of freq.entries()) {
    const wordCount = phrase.split(' ').length;
    if (count >= 2 || (count >= 1 && wordCount >= 3)) {
      filtered.push({ phrase, count, wordCount });
    }
  }

  // Sort by count * wordCount (longer phrases get bonus)
  filtered.sort((a, b) => (b.count * b.wordCount) - (a.count * a.wordCount));

  return filtered.slice(0, topN).map(f => ({ keyword: f.phrase, frequency: f.count }));
}

// Extract keywords from a site (all pages combined)
export function extractSiteKeywords(pages, topN = 50) {
  // Combine title + h1 + headings (weighted more) + body text
  const weightedTexts = pages.map(p => {
    const titleWeight = (p.title || '') + ' ' + (p.title || '') + ' ' + (p.title || ''); // 3x weight
    const h1Weight = (p.h1 || '') + ' ' + (p.h1 || '');  // 2x weight
    const headingsWeight = (p.headings || []).join(' ');
    return titleWeight + ' ' + h1Weight + ' ' + headingsWeight;
  }).join(' ');

  // Also get keywords from body but with less weight
  const bodyText = pages.map(p => p.bodyText || '').join(' ');
  // Sample body text to avoid processing millions of words
  const bodySample = bodyText.slice(0, 50000);

  const headingKeywords = extractKeywords(weightedTexts, topN);
  const bodyKeywords = extractKeywords(bodySample, topN);

  // Merge: heading keywords get priority
  const merged = new Map();
  for (const kw of headingKeywords) {
    merged.set(kw.keyword, { ...kw, source: 'heading', score: kw.frequency * 3 });
  }
  for (const kw of bodyKeywords) {
    if (merged.has(kw.keyword)) {
      merged.get(kw.keyword).score += kw.frequency;
      merged.get(kw.keyword).frequency += kw.frequency;
    } else {
      merged.set(kw.keyword, { ...kw, source: 'body', score: kw.frequency });
    }
  }

  return Array.from(merged.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}

// Extract topics from page titles and headings
export function extractTopics(pages) {
  const topics = new Map();

  for (const page of pages) {
    // Use title + h1 as topic indicators
    const topicText = cleanText((page.title || '') + ' ' + (page.h1 || ''));
    if (topicText.length < 5) continue;

    // Extract the most representative bigram/trigram
    const syllables = splitSyllables(topicText);
    const ngrams = generateNgrams(syllables, 2, 4);

    for (const gram of ngrams) {
      const parts = gram.split(' ');
      const meaningfulParts = parts.filter(p => !VI_STOP_SYLLABLES.has(p) && !EN_STOP_WORDS.has(p));
      if (meaningfulParts.length >= 2) {
        topics.set(gram, (topics.get(gram) || 0) + 1);
      }
    }
  }

  return topics;
}

// Detect content format with Vietnamese awareness
export function detectContentFormat(page) {
  const url = (page.url || '').toLowerCase();
  const title = (page.title || '').toLowerCase();
  const h1 = (page.h1 || '').toLowerCase();
  const combined = title + ' ' + h1 + ' ' + url;
  const wordCount = page.wordCount || 0;
  const hasVideo = page.hasVideo;
  const headings = page.headings || [];
  const questionHeadings = headings.filter(h => h.includes('?')).length;

  // Vietnamese patterns
  if (combined.match(/bảng giá|báo giá|price|pricing|giá bán/)) return 'bảng giá';
  if (combined.match(/hướng dẫn|cách|how to|tutorial|guide|hướng\s+dẫn/)) return 'hướng dẫn';
  if (combined.match(/so sánh|vs\.?|versus|compare|alternative|thay thế/)) return 'so sánh';
  if (combined.match(/đánh giá|review|nhận xét|phản hồi/)) return 'đánh giá';
  if (questionHeadings >= 3) return 'FAQ';
  if (combined.match(/case study|dự án|công trình|portfolio/)) return 'case study';
  if (combined.match(/tin tức|news|blog|bài viết/)) return 'tin tức';
  if (combined.match(/giới thiệu|about|về chúng tôi/)) return 'giới thiệu';
  if (combined.match(/sản phẩm|product|shop|cửa hàng/)) return 'sản phẩm';
  if (combined.match(/top|best|tốt nhất|\d+\s+(loại|cách|mẹo|lý do)/)) return 'listicle';
  if (combined.match(/liên hệ|contact|hotline/)) return 'liên hệ';
  if (hasVideo) return 'video';
  if (combined.match(/tool|calculator|công cụ|tính toán/)) return 'công cụ';
  if (wordCount > 2000) return 'long-form';

  return 'trang chuẩn';
}

// Classify search intent with Vietnamese awareness
export function classifyIntent(text) {
  const target = (text || '').toLowerCase();

  if (target.match(/giá|mua|bán|đặt hàng|order|buy|price|cost|báo giá|bảng giá|đại lý|phân phối/)) {
    return 'transactional';
  }
  if (target.match(/so sánh|vs|compare|alternative|review|đánh giá|tốt nhất|best|top|nên chọn|nên mua/)) {
    return 'commercial';
  }
  if (target.match(/liên hệ|contact|login|đăng nhập|tải|download/)) {
    return 'navigational';
  }
  return 'informational';
}

// Check if two keyword phrases overlap significantly
export function phrasesOverlap(a, b) {
  const partsA = new Set(a.split(' '));
  const partsB = new Set(b.split(' '));
  let overlap = 0;
  for (const p of partsA) {
    if (partsB.has(p)) overlap++;
  }
  return overlap >= Math.min(partsA.size, partsB.size) * 0.6;
}

// Deduplicate keyword list (remove near-duplicate phrases)
export function deduplicateKeywords(keywords) {
  const result = [];
  for (const kw of keywords) {
    const isDuplicate = result.some(existing => phrasesOverlap(existing.keyword, kw.keyword));
    if (!isDuplicate) {
      result.push(kw);
    }
  }
  return result;
}
