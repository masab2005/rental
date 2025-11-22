import React from 'react';
export default function BookingConfirm(){
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md card-modern p-8 text-center">
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#DCFCE7' }}>
          <span className="text-2xl">✓</span>
        </div>
        <h2 className="text-xl font-semibold" style={{ color: '#0F172A' }}>Booking Confirmed</h2>
        <p className="mt-2" style={{ color: '#64748B' }}>Your booking request was submitted. Check your bookings for status updates.</p>
      </div>
    </div>
  );
}
