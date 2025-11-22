import React from 'react';

export default function Footer(){
  return (
    <footer className="border-t mt-12" style={{ backgroundColor: '#0F172A', borderColor: '#1a2942', color: '#94A3B8' }}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4" style={{ color: '#FFFFFF' }}>CarRent</h3>
            <p className="text-sm" style={{ color: '#CBD5E1' }}>Your trusted partner for car rentals</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3" style={{ color: '#FFFFFF' }}>Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="transition hover:opacity-75" style={{ color: '#94A3B8' }}>Home</a></li>
              <li><a href="/cars" className="transition hover:opacity-75" style={{ color: '#94A3B8' }}>Browse Cars</a></li>
              <li><a href="#" className="transition hover:opacity-75" style={{ color: '#94A3B8' }}>About</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3" style={{ color: '#FFFFFF' }}>Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="transition hover:opacity-75" style={{ color: '#94A3B8' }}>Contact</a></li>
              <li><a href="#" className="transition hover:opacity-75" style={{ color: '#94A3B8' }}>FAQ</a></li>
              <li><a href="#" className="transition hover:opacity-75" style={{ color: '#94A3B8' }}>Help</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3" style={{ color: '#FFFFFF' }}>Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="transition hover:opacity-75" style={{ color: '#94A3B8' }}>Privacy</a></li>
              <li><a href="#" className="transition hover:opacity-75" style={{ color: '#94A3B8' }}>Terms</a></li>
              <li><a href="#" className="transition hover:opacity-75" style={{ color: '#94A3B8' }}>Cookies</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between" style={{ borderTop: '1px solid #1a2942' }}>
          <div className="text-sm">© {new Date().getFullYear()} CarRent. All rights reserved.</div>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="transition hover:opacity-75" style={{ color: '#94A3B8' }}>Twitter</a>
            <a href="#" className="transition hover:opacity-75" style={{ color: '#94A3B8' }}>Facebook</a>
            <a href="#" className="transition hover:opacity-75" style={{ color: '#94A3B8' }}>Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
