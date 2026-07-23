import React from 'react';

export default function ExportButton({ data }) {
  const handleExport = () => {
    if (!data || !data.keywordGaps) return;

    let csvContent = 'Keyword,Tần suất,Tìm thấy ở,Mức ưu tiên\n';
    
    data.keywordGaps.forEach(row => {
      const foundIn = row.foundIn ? `"${row.foundIn.join(', ')}"` : '""';
      csvContent += `"${row.keyword}",${row.frequency},${foundIn},"${row.priority}"\n`;
    });

    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'content-gap-analysis.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button className="btn btn-secondary" onClick={handleExport}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      <span>Xuất CSV</span>
    </button>
  );
}
