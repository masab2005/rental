import React from 'react';
export default function Toast({message}) {
  if (!message) return null;
  return <div className="fixed bottom-4 right-4 text-white px-4 py-2 rounded font-medium shadow-lg" style={{ backgroundColor: '#0F172A' }}>{message}</div>;
}
