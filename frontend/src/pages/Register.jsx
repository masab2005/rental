import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Register(){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [driverLicense, setDriverLicense] = useState('');
  const [role, setRole] = useState('customer');
  const [secretKey, setSecretKey] = useState('');
  const { register } = useAuth();
  const nav = useNavigate();

  async function submit(e){
    e.preventDefault();
    try {
      const payload = {
        username,
        password,
        role,
        name,
        phone,
      };
      if (role === 'customer') {
        payload.driverLicense = driverLicense;
      } else {
        payload.secretKey = secretKey;
      }
      await register(payload);
      alert('Registered successfully. Please login.');
      nav('/login');
    } catch (err) {
      alert(err.message || 'Registration failed');
    }
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md card-modern p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#0F172A' }}>Create Account</h1>
          <p style={{ color: '#64748B' }}>Join CarRent today</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#0F172A' }}>Account Type</label>
            <select 
              value={role} 
              onChange={e=>setRole(e.target.value)} 
              className="input-modern"
            >
              <option value="customer">Customer</option>
              <option value="staff">Staff Member</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#0F172A' }}>Username</label>
            <input 
              type="text"
              value={username} 
              onChange={e=>setUsername(e.target.value)} 
              className="input-modern"
              placeholder="Choose a username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#0F172A' }}>Full Name</label>
            <input 
              type="text"
              value={name} 
              onChange={e=>setName(e.target.value)} 
              className="input-modern"
              placeholder="Your full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#0F172A' }}>Phone (11 digits)</label>
            <input 
              type="tel"
              value={phone} 
              onChange={e=>setPhone(e.target.value)} 
              className="input-modern"
              placeholder="03001234567"
              required
            />
          </div>

          {role === 'customer' ? (
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#0F172A' }}>Driver License</label>
              <input 
                type="text"
                value={driverLicense} 
                onChange={e=>setDriverLicense(e.target.value)} 
                className="input-modern"
                placeholder="Driver license number"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#0F172A' }}>Staff Secret Key</label>
              <input 
                type="password"
                value={secretKey} 
                onChange={e=>setSecretKey(e.target.value)} 
                className="input-modern"
                placeholder="Enter staff secret key"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#0F172A' }}>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e=>setPassword(e.target.value)} 
              className="input-modern"
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn-primary w-full mt-6">
            Create Account
          </button>
        </form>

        <p className="text-center mt-6" style={{ color: '#64748B' }}>
          Already have an account?{' '}
          <a href="/login" className="font-semibold" style={{ color: '#3B82F6' }} onMouseEnter={(e) => e.target.style.color = '#1e3a8a'} onMouseLeave={(e) => e.target.style.color = '#3B82F6'}>
            Sign in here
          </a>
        </p>
      </div>
    </div>
  );
}
