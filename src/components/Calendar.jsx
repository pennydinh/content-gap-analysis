import React from 'react';

export default function Calendar({ calendar }) {
  if (!calendar || calendar.length === 0) return (
    <div className="glass-card fade-in">
      <p style={{ color: 'var(--text-muted)' }}>Chưa có dữ liệu lịch nội dung.</p>
    </div>
  );

  const grouped = calendar.reduce((acc, item) => {
    const m = item.month || 1;
    if (!acc[m]) acc[m] = [];
    acc[m].push(item);
    return acc;
  }, {});

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'P0': return 'badge-P0';
      case 'P1': return 'badge-P1';
      case 'P2': return 'badge-P2';
      case 'P3': return 'badge-P3';
      default: return 'badge-P3';
    }
  };

  return (
    <div className="fade-in">
      {Object.keys(grouped).map((month, idx) => (
        <div key={idx} className="glass-card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '14px', borderBottom: '1px solid var(--color-border)', marginBottom: '16px' }}>
            <div className="icon-box indigo">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <h3 style={{ margin: 0, color: 'var(--brand-primary)' }}>Lịch Nội Dung — Tháng {month}</h3>
          </div>

          <div className="table-container" style={{ border: 'none' }}>
            <table>
              <thead>
                <tr>
                  <th style={{ width: '110px' }}>Thời gian</th>
                  <th>Tên bài viết gợi ý</th>
                  <th>Loại</th>
                  <th>Keyword mục tiêu</th>
                  <th>Độ ưu tiên</th>
                </tr>
              </thead>
              <tbody>
                {grouped[month].sort((a, b) => a.week - b.week).map((item, i) => (
                  <tr key={i}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--brand-primary)' }}>Tuần {item.week}</td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.title}</td>
                    <td><span className="badge" style={{ background: 'var(--brand-light)', color: 'var(--brand-primary)' }}>{item.type}</span></td>
                    <td><span className="badge" style={{ background: '#ffffff', border: '1px solid var(--color-border)', color: 'var(--text-primary)' }}>{item.targetKeyword || item.keyword}</span></td>
                    <td><span className={`badge ${getPriorityClass(item.priority)}`}>{item.priority}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
