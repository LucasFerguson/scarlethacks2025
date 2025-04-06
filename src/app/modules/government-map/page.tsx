'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl'; // Import Mapbox GL JS
import 'mapbox-gl/dist/mapbox-gl.css'; // Include Mapbox CSS

// Debug Mapbox token
console.log('Mapbox Token:', process.env.NEXT_PUBLIC_MAPBOX_TOKEN);
console.log('Is Mapbox Token defined?', !!process.env.NEXT_PUBLIC_MAPBOX_TOKEN);
console.log('Environment variables:', process.env);

// Sample data for news stories
const SAMPLE_DATA = [
  {
    position: [-74.006, 40.7128], // New York
    title: 'New Healthcare Legislation',
    level: 'Federal',
    timestamp: new Date('2024-03-15').getTime(),
  },
  {
    position: [-118.2437, 34.0522], // Los Angeles
    title: 'Environmental Protection Initiative',
    level: 'State',
    timestamp: new Date('2024-03-12').getTime(),
  },
  {
    position: [-87.6298, 41.8781], // Chicago
    title: 'Education Funding Program',
    level: 'Local',
    timestamp: new Date('2024-03-10').getTime(),
  },
];

const INITIAL_VIEW_STATE = {
  longitude: -95.7129,
  latitude: 37.0902,
  zoom: 3,
};

export default function GovernmentMapPage() {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || !process.env.NEXT_PUBLIC_MAPBOX_TOKEN) return;

    // Initialize Mapbox map
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    const mapInstance = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: 'mapbox://styles/mapbox/light-v11', // Map style
      center: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude],
      zoom: INITIAL_VIEW_STATE.zoom,
    });

    // Add markers for SAMPLE_DATA
    SAMPLE_DATA.forEach((story) => {
      const marker = new mapboxgl.Marker({ color: getMarkerColor(story.level) })
        .setLngLat(story.position)
        .setPopup(
          new mapboxgl.Popup().setHTML(`
            <h3>${story.title}</h3>
            <p>Level: ${story.level}</p>
            <p>Posted on ${new Date(story.timestamp).toLocaleDateString()}</p>
          `)
        )
        .addTo(mapInstance);
    });

    setMap(mapInstance);

    return () => {
      mapInstance.remove(); // Cleanup on unmount
    };
  }, []);

  const getMarkerColor = (level: string) => {
    switch (level) {
      case 'Federal':
        return '#FF0000'; // Red
      case 'State':
        return '#0000FF'; // Blue
      case 'Local':
        return '#00FF00'; // Green
      default:
        return '#808080'; // Gray
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Map of Government Activity</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Filter Options</h2>
            {/* Filter options UI */}
          </div>

          <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Map View</h2>
            <div ref={mapContainerRef} style={{ height: '600px', width: '100%' }} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Government Activities</h2>
          {/* Recent activities UI */}
        </div>
      </div>
    </DashboardLayout>
  );
}
