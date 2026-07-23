export async function analyzeGaps(myUrl, competitorUrls, maxPages, kymaApiKey) {
  try {
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
      let errorMsg = '';
      try {
        const errJson = await response.json();
        errorMsg = errJson.details || errJson.error;
      } catch (e) {
        // If response is not JSON
        if (response.status === 504) {
          errorMsg = 'Hệ thống phản hồi quá thời gian quy định (Timeout). Vui lòng thử giảm số lượng trang crawl xuống (ví dụ 10 hoặc 20 trang).';
        } else if (response.status === 500) {
          errorMsg = 'Máy chủ AI gặp sự cố phản hồi. Vui lòng kiểm tra lại Kyma API Key hoặc thử lại sau.';
        } else {
          errorMsg = `Lỗi hệ thống (${response.status}: ${response.statusText})`;
        }
      }
      throw new Error(errorMsg || `Lỗi kết nối máy chủ (${response.status})`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Lỗi khi phân tích:', error);
    throw error;
  }
}
