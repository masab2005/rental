import React from 'react';

export default function Modal({open, onClose, children, title}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
      <div className="rounded p-4 w-11/12 md:w-2/3 card-modern">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold" style={{ color: '#0F172A' }}>{title}</h3>
          <button onClick={onClose} className="font-semibold" style={{ color: '#EF4444' }}>Close</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
