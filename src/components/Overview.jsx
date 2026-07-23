import React from 'react';

export default function Overview({ data }) {
  if (!data) return null;

  const { siteStats, keywordGaps, priorities } = data;
  const myStats = siteStats?.you || { url: 'N/A', pageCount: 0, avgWords: 0 };
  const comps = siteStats?.competitors || [];
  
  const totalCompPages = comps.reduce((acc, c) => acc + c.pageCount, 0);
  const gapCount = keywordGaps?.length || 0;
  const highPriorityCount = priorities?.filter(p => p.priority === 'P0' || p.priority === 'P1').length || 0;

  return (
    <div className="fade-in">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="icon-box indigo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <div>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Trang của bạn</span>
            <h2 style={{ margin: '4px 0 0 0', color: 'var(--text-primary)', fontSize: '1.75rem', fontFamily: 'var(--font-mono)' }}>{myStats.pageCount}</h2>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="icon-box cyan">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Trang đối thủ</span>
            <h2 style={{ margin: '4px 0 0 0', color: 'var(--text-primary)', fontSize: '1.75rem', fontFamily: 'var(--font-mono)' }}>{totalCompPages}</h2>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="icon-box amber">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.778-7.778zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
          </div>
          <div>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Keyword Gaps</span>
            <h2 style={{ margin: '4px 0 0 0', color: 'var(--accent-orange)', fontSize: '1.75rem', fontFamily: 'var(--font-mono)' }}>{gapCount}</h2>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="icon-box emerald">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
          </div>
          <div>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Cơ hội cao (P0+P1)</span>
            <h2 style={{ margin: '4px 0 0 0', color: 'var(--accent-emerald)', fontSize: '1.75rem', fontFamily: 'var(--font-mono)' }}>{highPriorityCount}</h2>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '28px' }}>
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>
            <h3 style={{ margin: 0 }}>So sánh Quy mô Website</h3>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>URL Website</th>
                  <th>Tổng số trang đã crawl</th>
                  <th>Số từ trung bình / trang</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ background: '#f8fafc' }}>
                  <td style={{ fontWeight: 600, color: 'var(--brand-primary)' }}>{myStats.url} (Website của bạn)</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{myStats.pageCount}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{myStats.avgWords} từ</td>
                </tr>
                {comps.map((c, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500 }}>{c.url}</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{c.pageCount}</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{c.avgWords} từ</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--accent-red)' }}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            <h3 style={{ margin: 0 }}>Top Cơ Hội Ưu Tiên Cao Nhất (P0)</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {priorities?.filter(p => p.priority === 'P0').slice(0, 3).map((p, i) => (
              <div key={i} style={{ padding: '16px 20px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: '#991b1b' }}>{p.title}</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Keyword: <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.keyword}</span></p>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <span className="badge badge-P0">P0 - Thắng nhanh</span>
                  <span className="badge" style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: 'var(--text-secondary)' }}>{p.type}</span>
                </div>
              </div>
            ))}
            {(!priorities || priorities.filter(p => p.priority === 'P0').length === 0) && (
              <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Chưa tìm thấy cơ hội P0 nào.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
