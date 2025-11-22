import React from 'react';

export default function FiltersPanel({onChange}) {
  return (
    <aside className="w-64 p-4 rounded-lg card-modern">
      <h4 className="font-semibold mb-4" style={{ color: '#0F172A' }}>Filters</h4>
      <form onChange={onChange}>
        <div className="mb-4">
          <label className="block text-sm mb-1" style={{ color: '#64748B' }}>Model</label>
          <input 
            className="input-modern" 
            name="model" 
            placeholder="Search model..."
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1" style={{ color: '#64748B' }}>Min Price</label>
          <input 
            className="input-modern" 
            name="priceMin" 
            type="number"
            placeholder="Minimum price..."
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1" style={{ color: '#64748B' }}>Max Price</label>
          <input 
            className="input-modern" 
            name="priceMax" 
            type="number"
            placeholder="Maximum price..."
          />
        </div>
        <div>
          <label className="block text-sm mb-1" style={{ color: '#64748B' }}>Status</label>
          <select 
            className="input-modern" 
            name="status"
            defaultValue=""
          >
            <option value="">All</option>
            <option value="available">Available</option>
            <option value="rented">Rented</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </form>
    </aside>
  );
}
