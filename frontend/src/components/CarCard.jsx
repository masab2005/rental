import React from 'react';
import { Link } from 'react-router-dom';

export default function CarCard({car}){
  if (!car) return null;
  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-slate-100 hover:border-blue-200 hover:-translate-y-2">
      {/* Image Container with Gradient Overlay */}
      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <img 
          src={car.carimageurl || 'https://via.placeholder.com/400x208?text=Car'} 
          alt={car.carmodel || 'car'} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
        />
        {/* Subtle dark overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Floating Glass Price Badge */}
        {car.carprice && (
          <div className="absolute top-3 right-3 backdrop-blur-xl bg-white/95 px-3 py-1.5 rounded-xl shadow-xl border border-white/50 transform group-hover:scale-105 transition-all duration-300">
            <div className="flex items-baseline gap-0.5">
              <span className="text-lg font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Rs{car.carprice}</span>
              <span className="text-[10px] font-semibold text-slate-500">/day</span>
            </div>
          </div>
        )}

        {/* Status Indicator */}
        {car.carstatus && (
          <div className="absolute bottom-4 left-4 flex items-center gap-2 backdrop-blur-lg bg-white/20 px-4 py-2 rounded-full border border-white/30">
            <div className={`w-2 h-2 rounded-full ${car.carstatus === 'available' ? 'bg-emerald-400' : 'bg-red-400'} shadow-lg`}></div>
            <span className="text-xs font-bold text-white uppercase tracking-wider">{car.carstatus}</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-5">
        {/* Car Title & Details */}
        <div className="space-y-3">
          <h3 className="text-2xl font-black text-slate-900 leading-tight tracking-tight group-hover:text-blue-600 transition-colors duration-300">
            {car.carmodel}
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full text-slate-700 font-semibold text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {car.caryear}
            </span>
            {car.cartype && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-full text-blue-700 font-semibold text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {car.cartype}
              </span>
            )}
            {car.transmission && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-full text-emerald-700 font-semibold text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {car.transmission}
              </span>
            )}
          </div>
        </div>

        {/* CTA Button with animated shine */}
        <Link 
          to={`/customer/book/${car.carid}`} 
          className="group/btn relative block w-full text-center px-6 py-4 rounded-2xl font-bold text-base bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-indigo-700 hover:to-indigo-800 text-white shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
          <span className="relative flex items-center justify-center gap-2">
            Book Now
            <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        </Link>
      </div>
    </div>
  );
}
