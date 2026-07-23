import React from 'react';

export default function FormatGaps({ formatData }) {
  if (!formatData || !formatData.formats) return (
    <div className="glass-card fade-in">
      <p style={{ color: 'var(--text-muted)' }}>Không có dữ liệu định dạng nội dung.</p>
    </div>
  );

  const missingFormats = formatData.missing || [];
  const maxCount = Math.max(
    ...formatData.formats.map(f => Math.max(f.yours || 0, f.compAvg || 0)),
    1
  );

  return (
    <div className="fade-in">
      <div className="glass-card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div className="icon-box indigo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          </div>
          <div>
            <h3 style={{ margin: 0 }}>So sánh Định dạng Nội dung (Content Formats)</h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Phân bổ định dạng bài viết (bảng giá, hướng dẫn, FAQ, so sánh...)</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '24px', fontSize: '0.875rem', fontWeight: 600 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: 'var(--brand-primary)' }}></div>
            <span>Website của bạn</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: '#94a3b8' }}></div>
            <span>Trung bình đối thủ</span>
          </div>
        </div>

        <div className="bar-chart">
          {formatData.formats.map((f, i) => {
            const yourWidth = `${((f.yours || 0) / maxCount) * 100}%`;
            const compWidth = `${((f.compAvg || 0) / maxCount) * 100}%`;
            
            return (
              <div key={i} className="bar-row">
                <div className="bar-label">{f.type}</div>
                <div className="bars">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="bar yours" style={{ width: yourWidth, minWidth: f.yours > 0 ? '8px' : '0' }}></div>
                    <span style={{ fontSize: '0.775rem', fontFamily: 'var(--font-mono)', color: 'var(--brand-primary)', fontWeight: 600 }}>{f.yours}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="bar comps" style={{ width: compWidth, minWidth: f.compAvg > 0 ? '8px' : '0' }}></div>
                    <span style={{ fontSize: '0.775rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{f.compAvg}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {missingFormats.length > 0 && (
        <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-orange)', background: '#fffbe6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--accent-orange)' }}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <h3 style={{ color: 'var(--accent-orange)', margin: 0, fontSize: '1rem' }}>Định dạng nội dung bạn còn thiếu</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            Bạn chưa sản xuất các dạng bài viết sau mà các trang đối thủ đang thực hiện:
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '14px' }}>
            {missingFormats.map((m, i) => (
              <span key={i} className="badge" style={{ background: '#ffffff', color: 'var(--accent-orange)', border: '1px solid #fde68a', fontSize: '0.85rem', padding: '6px 14px' }}>
                {m}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
