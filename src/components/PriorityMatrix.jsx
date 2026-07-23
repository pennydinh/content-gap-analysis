import React from 'react';

export default function PriorityMatrix({ priorities }) {
  if (!priorities || priorities.length === 0) return (
    <div className="glass-card fade-in">
      <p style={{ color: 'var(--text-muted)' }}>Không có dữ liệu ma trận ưu tiên.</p>
    </div>
  );

  const getSectionConfig = (p) => {
    switch(p) {
      case 'P0': return { title: 'P0 — Thắng Nhanh', sub: 'Tác động cao · Nỗ lực thấp', border: 'var(--accent-red)', bgHeader: '#ffe4e6', colorHeader: '#be123c' };
      case 'P1': return { title: 'P1 — Chiến Lược Trọng Tâm', sub: 'Tác động cao · Nỗ lực cao', border: 'var(--accent-orange)', bgHeader: '#fef3c7', colorHeader: '#b45309' };
      case 'P2': return { title: 'P2 — Nhiệm Vụ Bổ Sung', sub: 'Tác động thấp · Nỗ lực thấp', border: 'var(--accent-cyan)', bgHeader: '#e0f2fe', colorHeader: '#0369a1' };
      case 'P3': return { title: 'P3 — Cân Nhắc / Bỏ Qua', sub: 'Tác động thấp · Nỗ lực cao', border: 'var(--accent-gray)', bgHeader: '#f1f5f9', colorHeader: '#475569' };
      default: return { title: p, sub: '', border: 'var(--color-border)', bgHeader: '#f8fafc', colorHeader: 'var(--text-primary)' };
    }
  };

  const renderSection = (level) => {
    const items = priorities.filter(p => p.priority === level);
    const config = getSectionConfig(level);
    
    return (
      <div className="glass-card" style={{ borderTop: `4px solid ${config.border}`, display: 'flex', flexDirection: 'column', height: '100%', padding: '24px' }}>
        <div style={{ background: config.bgHeader, padding: '10px 14px', borderRadius: '8px', marginBottom: '16px' }}>
          <h3 style={{ color: config.colorHeader, fontSize: '0.975rem', margin: 0, fontWeight: 700 }}>{config.title}</h3>
          <span style={{ fontSize: '0.775rem', color: config.colorHeader, opacity: 0.85, fontWeight: 500 }}>{config.sub}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
          {items.map((item, i) => (
            <div key={i} style={{ padding: '12px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '6px', color: 'var(--text-primary)' }}>{item.title}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', fontSize: '0.775rem' }}>
                <span className="badge" style={{ background: '#ffffff', border: '1px solid var(--color-border)', color: 'var(--text-primary)' }}>{item.keyword}</span>
                <span className="badge" style={{ background: 'var(--brand-light)', color: 'var(--brand-primary)' }}>{item.type}</span>
                <span className="badge" style={{ background: '#ffffff', border: '1px solid var(--color-border)', color: 'var(--text-muted)' }}>Nỗ lực: {item.effort}</span>
                <span className="badge" style={{ background: '#ffffff', border: '1px solid var(--color-border)', color: 'var(--text-muted)' }}>Tác động: {item.impact}</span>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', margin: 'auto', fontSize: '0.875rem' }}>Chưa có nhiệm vụ ở nhóm này</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fade-in">
      <div className="matrix-grid">
        {renderSection('P0')}
        {renderSection('P1')}
        {renderSection('P2')}
        {renderSection('P3')}
      </div>
    </div>
  );
}
