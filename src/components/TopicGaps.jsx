import React from 'react';

export default function TopicGaps({ gaps, mySite, competitors }) {
  if (!gaps || gaps.length === 0) return (
    <div className="glass-card fade-in">
      <p style={{ color: 'var(--text-muted)' }}>Chưa tìm thấy dữ liệu lỗ hổng chủ đề.</p>
    </div>
  );

  const getStatus = (topic) => {
    const myCount = topic.myCount || 0;
    const comps = topic.competitors || [];
    const avgComp = comps.length ? comps.reduce((a, b) => a + (b.count || 0), 0) / comps.length : 0;
    const hasComps = comps.some(c => c.count > 0);

    if (myCount === 0 && hasComps) {
      return { 
        label: 'Thiếu hẳn', 
        bg: '#fef2f2', 
        color: '#dc2626', 
        border: '#fecaca',
        icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
      };
    } else if (myCount > 0 && myCount < avgComp) {
      return { 
        label: 'Yếu hơn', 
        bg: '#fffbe6', 
        color: '#d97706', 
        border: '#fde68a',
        icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      };
    } else {
      return { 
        label: 'Đủ bài', 
        bg: '#ecfdf5', 
        color: '#059669', 
        border: '#a7f3d0',
        icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      };
    }
  };

  return (
    <div className="glass-card fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div className="icon-box indigo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
        </div>
        <div>
          <h3 style={{ margin: 0 }}>So sánh Chủ đề Bài viết (Topic Coverage)</h3>
          <p style={{ margin: '2px 0 0 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Mức độ phủ bài viết theo từng nhóm chủ đề giữa bạn và đối thủ</p>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Chủ đề bài viết</th>
              <th style={{ color: 'var(--brand-primary)' }}>Bạn ({mySite})</th>
              {competitors?.map((c, i) => (
                <th key={i}>{c}</th>
              ))}
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {gaps.map((g, i) => {
              const status = getStatus(g);
              return (
                <tr key={i}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{g.topic}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--brand-primary)' }}>{g.myCount || 0} bài</td>
                  {competitors?.map((c, idx) => {
                    const compData = g.competitors?.find(x => x.url === c);
                    return <td key={idx} style={{ fontFamily: 'var(--font-mono)' }}>{compData ? compData.count : 0} bài</td>;
                  })}
                  <td>
                    <span style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '5px', 
                      padding: '4px 10px', 
                      borderRadius: 'var(--radius-pill)', 
                      background: status.bg, 
                      color: status.color, 
                      border: `1px solid ${status.border}`,
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}>
                      {status.icon}
                      <span>{status.label}</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
