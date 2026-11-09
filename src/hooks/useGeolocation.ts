import { useState, useCallback } from 'react';

export interface GeolocationState {
  coords: { lat: number; lng: number } | null;
  accuracy: number | null;
  isLoading: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    coords: null,
    accuracy: null,
    isLoading: false,
    error: null,
  });

  const requestLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setState(prev => ({ ...prev, error: 'La geolocalización no está soportada en este navegador.', isLoading: false }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          coords: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          accuracy: position.coords.accuracy,
          isLoading: false,
          error: null,
        });
      },
      (error) => {
        let errorMsg = 'Error al obtener la ubicación GPS.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = 'Permiso de ubicación denegado por el usuario.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = 'Información de ubicación no disponible.';
            break;
          case error.TIMEOUT:
            errorMsg = 'Tiempo de espera agotado al consultar GPS.';
            break;
        }
        setState(prev => ({ ...prev, isLoading: false, error: errorMsg }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, []);

  return {
    ...state,
    requestLocation,
  };
}

