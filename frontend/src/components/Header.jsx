import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Header(){
  const { user, logout } = useAuth();
  const nav = [
    { to: '/', label: 'Home' },
    { to: '/cars', label: 'Cars' },
  ];
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="group">
          <span className="text-2xl font-black text-blue-600 hover:text-blue-700 transition-colors">
            CarRent
          </span>
        </Link>
        <nav className="flex items-center gap-2">
          {nav.map(n => (
            <Link 
              key={n.to} 
              to={n.to} 
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200"
            >
              {n.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link 
                to="/account" 
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200"
              >
                Account
              </Link>
              {user.role === 'staff' ? (
                <Link 
                  to="/staff" 
                  className="px-4 py-2 text-sm font-bold bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  Staff Panel
                </Link>
              ) : (
                <Link 
                  to="/customer/bookings" 
                  className="px-4 py-2 text-sm font-bold bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  My Bookings
                </Link>
              )}
              <button 
                onClick={logout} 
                className="px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="px-5 py-2.5 text-sm font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
              >
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
