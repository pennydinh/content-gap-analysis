import React, { useState } from 'react';
import InputForm from './components/InputForm';
import LoadingState from './components/LoadingState';
import Overview from './components/Overview';
import KeywordGaps from './components/KeywordGaps';
import TopicGaps from './components/TopicGaps';
import FormatGaps from './components/FormatGaps';
import PriorityMatrix from './components/PriorityMatrix';
import Calendar from './components/Calendar';
import ExportButton from './components/ExportButton';

function transformData(raw) {
  const siteStats = {
    you: {
      url: raw.mySite?.url || 'N/A',
      pageCount: raw.mySite?.totalPages || 0,
      avgWords: raw.mySite?.avgWordCount || 0
    },
    competitors: (raw.competitors || []).map(c => ({
      url: c.url,
      pageCount: c.totalPages || 0,
      avgWords: c.avgWordCount || 0
    }))
  };

  const topicGaps = (raw.topicGaps || []).map(t => ({
    ...t,
    competitors: Object.entries(t.competitors || {}).map(([url, count]) => ({ url, count }))
  }));

  const myFormats = raw.formatGaps?.myFormats || {};
  const compFormats = raw.formatGaps?.competitorFormats || {};
  const allFormatTypes = new Set([
    ...Object.keys(myFormats),
    ...Object.values(compFormats).flatMap(cf => Object.keys(cf))
  ]);

  const formatsList = [];
  const missing = [];
  const compCount = Object.keys(compFormats).length || 1;

  for (const type of allFormatTypes) {
    const yours = myFormats[type] || 0;
    const compSum = Object.values(compFormats).reduce((sum, cf) => sum + (cf[type] || 0), 0);
    const compAvg = Math.round(compSum / compCount);
    formatsList.push({ type, yours, compAvg });
    if (yours === 0 && compAvg > 0) missing.push(type);
  }

  return {
    siteStats,
    keywordGaps: raw.keywordGaps || [],
    topicGaps,
    formatGaps: { formats: formatsList, missing },
    priorities: raw.priorityList || [],
    calendar: raw.calendar || []
  };
}

export default function App() {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const handleAnalysisSubmit = (data) => {
    const transformed = transformData(data);
    setAnalysisData(transformed);
    setLoading(false);
    setActiveTab('overview');
  };

  const handleReset = () => {
    setAnalysisData(null);
    setLoading(false);
    setError(null);
    setActiveTab('overview');
  };

  const renderTabContent = () => {
    if (!analysisData) return null;

    switch (activeTab) {
      case 'overview':
        return <Overview data={analysisData} />;
      case 'keywords':
        return <KeywordGaps gaps={analysisData.keywordGaps} />;
      case 'topics':
        return <TopicGaps 
                  gaps={analysisData.topicGaps} 
                  mySite={analysisData.siteStats?.you?.url} 
                  competitors={analysisData.siteStats?.competitors?.map(c => c.url)} 
                />;
      case 'formats':
        return <FormatGaps formatData={analysisData.formatGaps} />;
      case 'priority':
        return <PriorityMatrix priorities={analysisData.priorities} />;
      case 'calendar':
        return <Calendar calendar={analysisData.calendar} />;
      default:
        return <Overview data={analysisData} />;
    }
  };

  return (
    <div className="container">
      {!analysisData && !loading && (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          {error && (
            <div className="fade-in" style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '16px 20px', borderRadius: '12px', marginBottom: '24px', maxWidth: '800px', width: '100%', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span>{error}</span>
            </div>
          )}
          <InputForm onSubmit={handleAnalysisSubmit} onLoading={setLoading} onError={setError} />
        </div>
      )}

      {loading && (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LoadingState />
        </div>
      )}

      {analysisData && !loading && (
        <div className="fade-in" style={{ padding: '28px 0 64px 0' }}>
          <header className="app-header">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <div className="icon-box indigo">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </div>
                <h1 style={{ margin: 0, fontSize: '1.85rem' }}>
                  <span className="gradient-text">Content Gap Analysis</span>
                </h1>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
                Phân tích đối sánh nội dung cho: <span style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>{analysisData.siteStats?.you?.url || 'Website của bạn'}</span>
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <ExportButton data={analysisData} />
              <button className="btn btn-primary" onClick={handleReset}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6"/><path d="M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                <span>Phân tích mới</span>
              </button>
            </div>
          </header>

          <nav className="tabs-container">
            <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              <span>Tổng quan</span>
            </button>
            <button className={`tab-btn ${activeTab === 'keywords' ? 'active' : ''}`} onClick={() => setActiveTab('keywords')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.778-7.778zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
              <span>Keyword Gaps</span>
            </button>
            <button className={`tab-btn ${activeTab === 'topics' ? 'active' : ''}`} onClick={() => setActiveTab('topics')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
              <span>Topic Gaps</span>
            </button>
            <button className={`tab-btn ${activeTab === 'formats' ? 'active' : ''}`} onClick={() => setActiveTab('formats')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              <span>Format Gaps</span>
            </button>
            <button className={`tab-btn ${activeTab === 'priority' ? 'active' : ''}`} onClick={() => setActiveTab('priority')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
              <span>Ưu tiên (Matrix)</span>
            </button>
            <button className={`tab-btn ${activeTab === 'calendar' ? 'active' : ''}`} onClick={() => setActiveTab('calendar')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span>Lịch nội dung</span>
            </button>
          </nav>

          <main>
            {renderTabContent()}
          </main>
        </div>
      )}
    </div>
  );
}
