import React from 'react';

export default function Pagination({page=1, total=1, onChange}) {
  return (
    <div className="flex items-center gap-2">
      <button 
        disabled={page<=1} 
        onClick={()=>onChange(page-1)} 
        className="px-3 py-1 rounded font-medium transition-colors"
        style={{ 
          backgroundColor: page <= 1 ? '#E2E8F0' : '#3B82F6',
          color: page <= 1 ? '#94A3B8' : '#FFFFFF',
          cursor: page <= 1 ? 'not-allowed' : 'pointer'
        }}
      >
        Prev
      </button>
      <div style={{ color: '#0F172A' }}>Page {page} / {total}</div>
      <button 
        disabled={page>=total} 
        onClick={()=>onChange(page+1)} 
        className="px-3 py-1 rounded font-medium transition-colors"
        style={{ 
          backgroundColor: page >= total ? '#E2E8F0' : '#3B82F6',
          color: page >= total ? '#94A3B8' : '#FFFFFF',
          cursor: page >= total ? 'not-allowed' : 'pointer'
        }}
      >
        Next
      </button>
    </div>
  );
}
