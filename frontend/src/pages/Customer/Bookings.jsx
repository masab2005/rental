import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { fetchJson } from "../../api";

export default function Bookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("pending"); // 'pending', 'current'

  useEffect(() => {
    if (user?.userid) loadBookings();
  }, [user?.userid, filter]);

  async function loadBookings() {
    setLoading(true);
    setError(null);
    try {
      const endpoint =
        filter === "pending"
          ? `/rental/pendingRequests/${user.userid}`
          : `/rental/currentRentals/${user.userid}`;

      const data = await fetchJson(endpoint);
      setBookings(data.data || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">My Bookings</h2>
        <p className="text-slate-600">Manage your rental requests and active bookings</p>
      </div>

      {/* Filter buttons */}
      <div className="flex gap-3">
        {["pending", "current"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-6 py-3 rounded-xl font-bold transition-all duration-200 ${
              filter === type
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                : "bg-white text-slate-700 border-2 border-slate-200 hover:border-blue-300 hover:text-blue-600"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Loading/Error */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-slate-600 text-lg">Loading bookings...</div>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-600">
          Error: {error.message}
        </div>
      )}

      {/* Booking list */}
      {!loading && !error && (
        <div className="grid gap-6">
          {bookings.length ? (
            bookings.map((b) => (
              <div key={b.bookingid} className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className={`px-3 py-1 rounded-lg text-sm font-bold ${
                        filter === "pending" 
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}>
                        {filter === "pending" ? "Pending Approval" : "Active Rental"}
                      </div>
                      <div className="text-sm text-slate-500">
                        Booking #{b.bookingid}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {b.carimageurl && (
                        <img 
                          src={b.carimageurl.replace('/upload/', '/upload/w_120,h_80,c_fill,q_auto:best,f_auto/')} 
                          alt={b.carmodel}
                          className="w-24 h-16 object-cover rounded-lg shadow-md"
                        />
                      )}
                      <div>
                        <div className="text-xl font-black text-slate-900">
                          {b.carmodel || "Unknown"} {b.caryear}
                        </div>
                        <div className="text-sm text-slate-600 mt-1">
                          {new Date(b.startdate).toLocaleDateString()} → {new Date(b.enddate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-sm font-semibold text-slate-500">Total Amount</div>
                    <div className="text-3xl font-black text-blue-600">
                      Rs{typeof b.totalamount === "number" ? b.totalamount.toFixed(2) : b.totalamount}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="text-xl font-bold text-slate-900 mb-2">No {filter} bookings</div>
              <div className="text-slate-600">
                {filter === "pending" 
                  ? "You don't have any pending booking requests" 
                  : "You don't have any active rentals at the moment"}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
