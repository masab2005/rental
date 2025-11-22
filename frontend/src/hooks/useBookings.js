import { useFetch } from './useFetch';

export function useBookings(userId){
  const qs = userId ? `?userId=${userId}` : '';
  return useFetch(`/rental/bookings${qs}`);
}
