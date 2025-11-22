import React, { useState, useEffect } from 'react';
import { fetchJson } from '../../api';
import Modal from '../../components/Modal';

export default function ManageCars(){
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [formData, setFormData] = useState({
    carBrand: '', carModel: '', carYear: '', carType: '', carPrice: '', 
    carStatus: 'available', carImage: '', description: '', seats: '', 
    transmission: '', fuelType: ''
  });

  async function loadCars(){
    setLoading(true);
    try {
      const data = await fetchJson('/car/cars');
      setCars(data.data || data || []);
    } catch (e) {
      alert(e.message || 'Failed to load cars');
    } finally { setLoading(false); }
  }

  useEffect(() => { loadCars(); }, []);

  function openEditModal(car){
    setEditingCar(car);
    setFormData({
      carBrand: car.carBrand || '', carModel: car.carModel || '', carYear: car.carYear || '', 
      carType: car.carType || '', carPrice: car.carPrice || '', carStatus: car.carStatus || 'available', 
      carImage: car.carImage || '', description: car.description || '', seats: car.seats || '', 
      transmission: car.transmission || '', fuelType: car.fuelType || ''
    });
    setShowModal(true);
  }

  function openNewCarModal(){
    setEditingCar(null);
    setFormData({
      carBrand: '', carModel: '', carYear: '', carType: '', carPrice: '', 
      carStatus: 'available', carImage: '', description: '', seats: '', 
      transmission: '', fuelType: ''
    });
    setShowModal(true);
  }

  async function saveCar(){
    try {
      if (editingCar) {
        await fetchJson(`/car/cars/${editingCar.carId}`, {
          method: 'PUT',
          body: formData
        });
        alert('Car updated successfully');
      } else {
        await fetchJson('/car/cars', {
          method: 'POST',
          body: formData
        });
        alert('Car created successfully');
      }
      setShowModal(false);
      loadCars();
    } catch (e) {
      alert(e.message || 'Failed to save car');
    }
  }

  async function deleteCar(carId){
    if (!confirm('Are you sure you want to delete this car?')) return;
    try {
      await fetchJson(`/car/cars/${carId}`, { method: 'DELETE' });
      alert('Car deleted successfully');
      loadCars();
    } catch (e) {
      alert(e.message || 'Failed to delete car');
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Manage Cars</h2>
        <button 
          onClick={openNewCarModal}
          className="px-4 py-2 rounded-lg font-medium text-white transition-all"
          style={{ backgroundColor: '#3B82F6' }}
        >
          + Add New Car
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderBottomColor: '#3B82F6' }}></div>
        </div>
      ) : cars.length === 0 ? (
        <div className="text-center py-12" style={{ color: '#94A3B8' }}>
          No cars found. Add a new car to get started.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cars.map(c => (
            <div key={c.carId} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-40 bg-gray-200 overflow-hidden">
                <img src={c.carImage || 'https://via.placeholder.com/400x200?text=Car'} alt={c.carModel} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold" style={{ color: '#0F172A' }}>
                  {c.carBrand} {c.carModel}
                </h3>
                <p style={{ color: '#64748B' }} className="text-sm mb-3">
                  {c.carYear} | {c.carType}
                </p>
                <div className="mb-3 space-y-1">
                  <p style={{ color: '#64748B' }} className="text-sm">
                    <span className="font-semibold" style={{ color: '#3B82F6' }}>${c.carPrice}</span>/day
                  </p>
                  <p style={{ color: '#64748B' }} className="text-sm">
                    Status: <span className={`font-semibold ${c.carStatus === 'available' ? 'text-green-600' : 'text-red-600'}`}>
                      {c.carStatus}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2 pt-3 border-t">
                  <button 
                    onClick={() => openEditModal(c)}
                    className="flex-1 px-3 py-2 rounded font-medium text-sm transition-colors"
                    style={{ backgroundColor: '#DBEAFE', color: '#3B82F6' }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => deleteCar(c.carId)}
                    className="flex-1 px-3 py-2 rounded font-medium text-sm transition-colors"
                    style={{ backgroundColor: '#FEE2E2', color: '#EF4444' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal open={showModal} title={editingCar ? 'Edit Car' : 'Add New Car'} onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#0F172A' }}>Brand</label>
                <input 
                  type="text" 
                  value={formData.carBrand}
                  onChange={(e) => setFormData({...formData, carBrand: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  style={{ borderColor: '#E2E8F0' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#0F172A' }}>Model</label>
                <input 
                  type="text" 
                  value={formData.carModel}
                  onChange={(e) => setFormData({...formData, carModel: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  style={{ borderColor: '#E2E8F0' }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#0F172A' }}>Year</label>
                <input 
                  type="number" 
                  value={formData.carYear}
                  onChange={(e) => setFormData({...formData, carYear: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  style={{ borderColor: '#E2E8F0' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#0F172A' }}>Type</label>
                <input 
                  type="text" 
                  value={formData.carType}
                  onChange={(e) => setFormData({...formData, carType: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  style={{ borderColor: '#E2E8F0' }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#0F172A' }}>Price/Day</label>
                <input 
                  type="number" 
                  value={formData.carPrice}
                  onChange={(e) => setFormData({...formData, carPrice: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  style={{ borderColor: '#E2E8F0' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#0F172A' }}>Status</label>
                <select 
                  value={formData.carStatus}
                  onChange={(e) => setFormData({...formData, carStatus: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  style={{ borderColor: '#E2E8F0' }}
                >
                  <option value="available">Available</option>
                  <option value="rented">Rented</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#0F172A' }}>Image URL</label>
              <input 
                type="text" 
                value={formData.carImage}
                onChange={(e) => setFormData({...formData, carImage: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
                style={{ borderColor: '#E2E8F0' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#0F172A' }}>Description</label>
              <textarea 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
                style={{ borderColor: '#E2E8F0' }}
                rows="3"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#0F172A' }}>Seats</label>
                <input 
                  type="number" 
                  value={formData.seats}
                  onChange={(e) => setFormData({...formData, seats: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  style={{ borderColor: '#E2E8F0' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#0F172A' }}>Transmission</label>
                <input 
                  type="text" 
                  value={formData.transmission}
                  onChange={(e) => setFormData({...formData, transmission: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  style={{ borderColor: '#E2E8F0' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#0F172A' }}>Fuel Type</label>
                <input 
                  type="text" 
                  value={formData.fuelType}
                  onChange={(e) => setFormData({...formData, fuelType: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  style={{ borderColor: '#E2E8F0' }}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button 
                onClick={saveCar}
                className="flex-1 px-4 py-2 rounded-lg font-medium text-white transition-all"
                style={{ backgroundColor: '#3B82F6' }}
              >
                {editingCar ? 'Update Car' : 'Create Car'}
              </button>
              <button 
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 rounded-lg font-medium transition-all"
                style={{ backgroundColor: '#E2E8F0', color: '#0F172A' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
