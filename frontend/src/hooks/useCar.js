import { useFetch } from './useFetch';

export function useCar(id){
  return useFetch(id ? `/car/cars/${id}` : null, null, [id]);
}
