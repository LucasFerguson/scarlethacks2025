'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import 'mapbox-gl/dist/mapbox-gl.css';

const Map = dynamic(
  () => import('react-map-gl/mapbox').then((mod) => mod.Map),
  { ssr: false }
);

const DEFAULT_VIEW_STATE = {
  longitude: -100,
  latitude: 40,
  zoom: 3.5
};

export default function MapApp() {
  const [viewState, setViewState] = useState(DEFAULT_VIEW_STATE);

  // Debugging token availability
  console.log('Mapbox Token:', process.env.NEXT_PUBLIC_MAPBOX_TOKEN);
  console.log('Token defined?', !!process.env.NEXT_PUBLIC_MAPBOX_TOKEN);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        style={{ width: '100%', height: '100%' }}
      >
        {/* Add map children here */}
      </Map>
    </div>
  );
}

// For explicit rendering (if needed)
export function renderToDOM(container: HTMLElement) {
  require('react-dom/client').createRoot(container).render(<MapApp />);
}
