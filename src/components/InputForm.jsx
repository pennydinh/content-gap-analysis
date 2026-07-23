import React, { useState, useEffect } from 'react';
import { analyzeGaps } from '../utils/api';

export default function InputForm({ onSubmit, onLoading, onError }) {
  const [kymaApiKey, setKymaApiKey] = useState('');
  const [myUrl, setMyUrl] = useState('');
  const [competitors, setCompetitors] = useState(['', '']);
  const [maxPages, setMaxPages] = useState('20');

  useEffect(() => {
    const savedKey = localStorage.getItem('kyma_api_key');
    if (savedKey) setKymaApiKey(savedKey);
  }, []);

  const handleKeyChange = (val) => {
    setKymaApiKey(val);
    localStorage.setItem('kyma_api_key', val);
  };

  const handleAddCompetitor = () => {
    if (competitors.length < 5) {
      setCompetitors([...competitors, '']);
    }
  };

  const handleRemoveCompetitor = (index) => {
    if (competitors.length > 1) {
      const newComps = [...competitors];
      newComps.splice(index, 1);
      setCompetitors(newComps);
    }
  };

  const handleChangeCompetitor = (index, value) => {
    const newComps = [...competitors];
    newComps[index] = value;
    setCompetitors(newComps);
  };

  const validateUrl = (url) => {
    return url.startsWith('http://') || url.startsWith('https://');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateUrl(myUrl)) {
      onError('URL của bạn phải bắt đầu bằng http:// hoặc https://');
      return;
    }
    
    const validCompetitors = competitors.filter(c => c.trim() !== '');
    if (validCompetitors.length === 0) {
      onError('Vui lòng nhập ít nhất 1 URL đối thủ');
      return;
    }

    for (let url of validCompetitors) {
      if (!validateUrl(url)) {
        onError('Tất cả URL đối thủ phải bắt đầu bằng http:// hoặc https://');
        return;
      }
    }

    onLoading(true);
    onError(null);
    try {
      const data = await analyzeGaps(myUrl, validCompetitors, parseInt(maxPages), kymaApiKey);
      onSubmit(data);
    } catch (err) {
      onError(err.message || 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
      onLoading(false);
    }
  };

  return (
    <div className="glass-card fade-in" style={{ maxWidth: '740px', width: '100%', margin: '24px auto', padding: '36px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'var(--brand-light)', color: 'var(--brand-primary)', borderRadius: 'var(--radius-pill)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '16px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <span>Công cụ Phân tích SEO On-Page AI</span>
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>
          Phân Tích Lỗ Hổng Nội Dung
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.975rem', maxWidth: '540px', margin: '0 auto' }}>
          Tự động cào dữ liệu và dùng AI đối soát bài viết giữa bạn với đối thủ cạnh tranh.
        </p>
      </div>

      {/* Step 1: Kyma API Banner & Key Input */}
      <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '12px', padding: '20px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--accent-cyan)' }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0369a1' }}>Bước 1: Cấu hình Kyma API Key</span>
          </div>
          <a 
            href="https://kymaapi.com?aff=offer" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-secondary"
            style={{ padding: '6px 14px', fontSize: '0.825rem', background: '#ffffff', color: '#0284c7', borderColor: '#7dd3fc', textDecoration: 'none' }}
          >
            <span>Đăng ký lấy Key tại Kyma API</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#0369a1', marginBottom: '12px', lineHeight: 1.5 }}>
          Dán <b>Kyma API Key</b> của bạn bên dưới để kích hoạt AI xử lý (nếu để trống hệ thống sẽ dùng key hệ thống mặc định).
        </p>
        <input 
          type="password" 
          className="form-input" 
          placeholder="kyma-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" 
          value={kymaApiKey}
          onChange={(e) => handleKeyChange(e.target.value)}
          style={{ background: '#ffffff', borderColor: '#7dd3fc' }}
        />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            <span>URL Website của bạn</span>
          </label>
          <input 
            type="text" 
            className="form-input" 
            placeholder="https://diennuocthinhthanh.com" 
            value={myUrl}
            onChange={(e) => setMyUrl(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <span>Website đối thủ cạnh tranh (1 đến 5 trang)</span>
          </label>
          {competitors.map((comp, index) => (
            <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <input 
                type="text" 
                className="form-input" 
                placeholder={`https://doithu${index + 1}.com`} 
                value={comp}
                onChange={(e) => handleChangeCompetitor(index, e.target.value)}
              />
              {competitors.length > 1 && (
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={() => handleRemoveCompetitor(index)}
                  title="Xóa đối thủ này"
                  style={{ padding: '0 14px' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              )}
            </div>
          ))}
          {competitors.length < 5 && (
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={handleAddCompetitor}
              style={{ marginTop: '4px', fontSize: '0.85rem' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              <span>Thêm URL đối thủ</span>
            </button>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <span>Giới hạn số trang crawl cho mỗi site</span>
          </label>
          <select 
            className="form-select" 
            value={maxPages} 
            onChange={(e) => setMaxPages(e.target.value)}
          >
            <option value="10">10 trang / site (~20 giây)</option>
            <option value="20">20 trang / site (~30 giây - Khuyên dùng)</option>
            <option value="50">50 trang / site (~1 phút)</option>
            <option value="100">100 trang / site (~2 phút)</option>
            <option value="500">Toàn bộ website (Tối đa 500 trang sitemap)</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '12px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <span>Bắt đầu phân tích AI</span>
        </button>
      </form>
    </div>
  );
}
