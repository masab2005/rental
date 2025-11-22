import React from 'react';

export default function CarCarousel({ images = [] }) {
  if (!images.length) return <div className="h-64 flex items-center justify-center rounded" style={{ backgroundColor: '#E2E8F0', color: '#64748B' }}>No images</div>;
  return (
    <div className="grid grid-cols-3 gap-2">
      {images.map((src, i) => (
        <img key={i} src={src} alt={`img-${i}`} className="w-full h-48 object-cover rounded" />
      ))}
    </div>
  );
}
