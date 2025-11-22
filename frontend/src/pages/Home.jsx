import React from 'react';
import { Link } from 'react-router-dom';

export default function Home(){
  return (
    <div>
      {/* Hero Section */}
      <section className="rounded-2xl p-12 mb-8 text-white shadow-xl" style={{ backgroundColor: '#3B82F6' }}>
        <h1 className="text-5xl font-bold mb-3">Find Your Perfect Ride</h1>
        <p className="text-lg mb-6" style={{ color: '#DBEAFE' }}>Search and book premium cars quickly and securely.</p>
        <Link 
          to="/cars" 
          className="btn-secondary inline-flex items-center gap-2"
          style={{ backgroundColor: '#FFFFFF', color: '#3B82F6' }}
        >
          Browse All Cars →
        </Link>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="card-modern p-6 text-center">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#DBEAFE' }}>
            <span className="text-2xl">⚡</span>
          </div>
          <h3 className="font-bold text-lg mb-2" style={{ color: '#0F172A' }}>Quick Booking</h3>
          <p style={{ color: '#64748B' }}>Book your car in just a few minutes</p>
        </div>
        <div className="card-modern p-6 text-center">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#DCFCE7' }}>
            <span className="text-2xl">🛡️</span>
          </div>
          <h3 className="font-bold text-lg mb-2" style={{ color: '#0F172A' }}>Secure & Safe</h3>
          <p style={{ color: '#64748B' }}>Your data is protected with encryption</p>
        </div>
        <div className="card-modern p-6 text-center">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#FEF3C7' }}>
            <span className="text-2xl">💰</span>
          </div>
          <h3 className="font-bold text-lg mb-2" style={{ color: '#0F172A' }}>Best Prices</h3>
          <p style={{ color: '#64748B' }}>Competitive rates with no hidden charges</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="card-modern p-8" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold mb-2" style={{ color: '#0F172A' }}>Ready to get started?</h2>
            <p style={{ color: '#64748B' }}>Join thousands of satisfied customers renting cars with us</p>
          </div>
          <div className="flex items-center justify-end">
            <Link to="/cars" className="btn-primary">
              Browse Cars
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
