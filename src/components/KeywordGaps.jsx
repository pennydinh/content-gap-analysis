import React, { useState } from 'react';

export default function KeywordGaps({ gaps }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  if (!gaps) return null;

  const normalizePriority = (p) => {
    if (!p) return 'low';
    const lower = p.toLowerCase();
    if (lower === 'high' || lower === 'cao') return 'high';
    if (lower === 'medium' || lower === 'trung bình') return 'medium';
    return 'low';
  };

  const getPriorityLabel = (priority) => {
    const normalized = normalizePriority(priority);
    switch (normalized) {
      case 'high': return 'Cao';
      case 'medium': return 'Trung bình';
      case 'low': return 'Thấp';
      default: return priority;
    }
  };

  const getPriorityClass = (priority) => {
    const normalized = normalizePriority(priority);
    switch (normalized) {
      case 'high': return 'badge-P0';
      case 'medium': return 'badge-P1';
      case 'low': return 'badge-P3';
      default: return 'badge-P3';
    }
  };

  const filtered = gaps.filter(g => {
    const norm = normalizePriority(g.priority);
    if (filter !== 'all' && norm !== filter) return false;
    if (search && !g.keyword.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => b.frequency - a.frequency);

  return (
    <div className="fade-in glass-card">
      {/* Notice Banner */}
      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '14px 18px', marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#2563eb', marginTop: '2px', flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        <div style={{ fontSize: '0.875rem', color: '#1e40af', lineHeight: 1.5 }}>
          <b>Lưu ý quan trọng cho SEO:</b> Dữ liệu trên được cào và đối soát trực tiếp từ nội dung thực tế trên các trang đối thủ (chính xác 100% về mặt nội dung đối thủ đang có). Tuy nhiên, công cụ <b>chưa kết nối Search Volume</b> của Google. Bạn nên check lại lượng tìm kiếm hàng tháng trên Google Keyword Planner trước khi chốt thứ tự triển khai.
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter('all')}>Tất cả</button>
          <button className={`btn ${filter === 'high' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter('high')}>Cao</button>
          <button className={`btn ${filter === 'medium' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter('medium')}>Trung bình</button>
          <button className={`btn ${filter === 'low' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter('low')}>Thấp</button>
        </div>
        <div>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Tìm kiếm keyword..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '250px', margin: 0 }}
          />
        </div>
      </div>

      <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>Hiển thị {filtered.length} kết quả</p>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Keyword</th>
              <th>Tần suất xuất hiện ở đối thủ</th>
              <th>Tìm thấy tại URL đối thủ</th>
              <th>Mức ưu tiên đề xuất</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((g, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{g.keyword}</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>{g.frequency} lần</td>
                <td style={{ fontSize: '0.85rem' }}>{g.foundIn?.join(', ') || 'N/A'}</td>
                <td>
                  <span className={`badge ${getPriorityClass(g.priority)}`}>
                    {getPriorityLabel(g.priority)}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '32px' }}>Không tìm thấy kết quả phù hợp.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
