import React, { useState, useEffect } from 'react';

const MESSAGES = [
  "Đang truy cập và quét sitemap trang web của bạn...",
  "Đang cào dữ liệu HTML bài viết của các đối thủ...",
  "Đang đưa nội dung tới Kyma AI phân tích...",
  "Đang bóc tách cụm từ khóa (N-grams) và chủ đề...",
  "Đang so sánh định dạng bài viết & phân loại Intent...",
  "Đang tính toán ma trận ưu tiên P0 - P3...",
  "Đang tổng hợp Lịch nội dung 12 tuần..."
];

export default function LoadingState() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-container fade-in">
      <div className="pulse-loader"></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--brand-primary)', animation: 'spin 1.5s linear infinite' }}><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        <h2 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>
          {MESSAGES[msgIndex]}
        </h2>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Hệ thống AI đang đọc và đối soát từng bài viết. Vui lòng chờ khoảng 30 - 60 giây.</p>
    </div>
  );
}
