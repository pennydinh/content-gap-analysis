export async function analyzeGaps(myUrl, competitorUrls, maxPages, kymaApiKey) {
  try {
    // In production (Railway), fetch relative path /api/analyze; in local dev fallback to http://localhost:3001/api/analyze
    const apiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
      ? 'http://localhost:3001/api/analyze' 
      : '/api/analyze';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ myUrl, competitorUrls, maxPages, kymaApiKey }),
    });
    
    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.details || errJson.error || `Lỗi server: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Lỗi khi phân tích:', error);
    throw error;
  }
}
