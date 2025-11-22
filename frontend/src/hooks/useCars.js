import { useFetch } from './useFetch';

export function useCars(query='') {
  const qs = query ? `?${query}` : '';
  return useFetch(`/car/cars${qs}`);
}
