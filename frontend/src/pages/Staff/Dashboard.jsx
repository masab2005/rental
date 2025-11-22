import React from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard(){
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4" style={{ color: '#0F172A' }}>Staff Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/staff/pending" className="card-modern p-4 shadow hover:shadow-lg transition-shadow">
          <div style={{ color: '#3B82F6' }} className="font-semibold">Pending Requests</div>
          <p className="text-sm mt-2" style={{ color: '#64748B' }}>Review and approve bookings</p>
        </Link>
        <Link to="/staff/manage-cars" className="card-modern p-4 shadow hover:shadow-lg transition-shadow">
          <div style={{ color: '#3B82F6' }} className="font-semibold">Manage Cars</div>
          <p className="text-sm mt-2" style={{ color: '#64748B' }}>Edit and update car inventory</p>
        </Link>
        <Link to="/staff/maintenance" className="card-modern p-4 shadow hover:shadow-lg transition-shadow">
          <div style={{ color: '#3B82F6' }} className="font-semibold">Maintenance</div>
          <p className="text-sm mt-2" style={{ color: '#64748B' }}>Track maintenance tasks</p>
        </Link>
      </div>
    </div>
  );
}
