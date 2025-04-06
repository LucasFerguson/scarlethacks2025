'use client';

import { useEffect, useRef, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';

// Set your Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

interface Agency {
  id: number;
  name: string;
  position: [number, number];
  type: string;
  contact: string;
  focus: string;
}

const CHICAGO_COORDINATES: [number, number] = [-87.6298, 41.8781]; // Chicago center
const ENVIRONMENTAL_AGENCIES: Agency[] = [
  {
    id: 1,
    name: 'Chicago Department of Public Health',
    position: [-87.6298, 41.8781],
    type: 'Government',
    contact: '(312) 747-9884',
    focus: 'Environmental Health & Safety',
  },
  {
    id: 2,
    name: 'MWRD Industrial Waste Division',
    position: [-87.6337, 41.8775],
    type: 'Water Management',
    contact: '(312) 751-5123',
    focus: 'Wastewater Treatment',
  },
  {
    id: 3,
    name: 'Illinois EPA Chicago Office',
    position: [-87.6319, 41.8832],
    type: 'State Agency',
    contact: '(312) 814-3117',
    focus: 'Environmental Regulation',
  },
];

export default function ChicagoEnvironmentMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);

  // Initialize the Mapbox map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const mapInstance = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: CHICAGO_COORDINATES,
      zoom: 10,
    });

    // Add markers for environmental agencies
    ENVIRONMENTAL_AGENCIES.forEach((agency) => {
      const markerElement = document.createElement('div');
      markerElement.className = 'marker';
      markerElement.style.width = '12px';
      markerElement.style.height = '12px';
      markerElement.style.backgroundColor = '#28a745';
      markerElement.style.borderRadius = '50%';
      markerElement.style.cursor = 'pointer';

      // Add click event to the marker
      markerElement.addEventListener('click', () => {
        setSelectedAgency(agency);
      });

      new mapboxgl.Marker(markerElement)
        .setLngLat(agency.position)
        .addTo(mapInstance);
    });

    setMap(mapInstance);

    return () => mapInstance.remove(); // Cleanup on component unmount
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Chicago Environmental Agencies</h1>

      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-[600px] rounded-lg shadow-lg" />

      {/* Popup for selected agency */}
      {selectedAgency && (
        <div className="fixed bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 z-50 max-w-sm">
          <div className="space-y-2">
            <h3 className="font-bold text-lg">{selectedAgency.name}</h3>
            <p><strong>Type:</strong> {selectedAgency.type}</p>
            <p><strong>Focus:</strong> {selectedAgency.focus}</p>
            <p><strong>Contact:</strong> {selectedAgency.contact}</p>
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
              onClick={() => setSelectedAgency(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* List of Agencies */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Featured Agencies</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ENVIRONMENTAL_AGENCIES.map((agency) => (
            <div
              key={agency.id}
              className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => setSelectedAgency(agency)}
            >
              <h3 className="font-medium">{agency.name}</h3>
              <p className="text-sm text-black mt-1">{agency.type}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
