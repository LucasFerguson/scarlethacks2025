'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useState } from 'react';
import { DeckGL } from '@deck.gl/react';
import { ScatterplotLayer } from '@deck.gl/layers';
import { StaticMap } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

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
  pitch: 0,
  bearing: 0
};

export default function GovernmentMapPage() {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);

  const layers = [
    new ScatterplotLayer({
      id: 'news-points',
      data: SAMPLE_DATA,
      pickable: true,
      opacity: 0.8,
      stroked: true,
      filled: true,
      radiusScale: 6,
      radiusMinPixels: 3,
      radiusMaxPixels: 100,
      lineWidthMinPixels: 1,
      getPosition: d => d.position,
      getFillColor: d => {
        switch (d.level) {
          case 'Federal': return [255, 0, 0]; // Red
          case 'State': return [0, 0, 255]; // Blue
          case 'Local': return [0, 255, 0]; // Green
          default: return [128, 128, 128];
        }
      },
      getLineColor: [0, 0, 0],
      getRadius: 10000,
    })
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Map of Government Activity</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Filter Options</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Government Level</label>
                <select className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">All Levels</option>
                  <option value="federal">Federal</option>
                  <option value="state">State</option>
                  <option value="local">Local</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Policy Area</label>
                <select className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">All Areas</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="environment">Environment</option>
                  <option value="economy">Economy</option>
                  <option value="technology">Technology</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Time Period</label>
                <select className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="last-month">Last Month</option>
                  <option value="last-3-months">Last 3 Months</option>
                  <option value="last-6-months">Last 6 Months</option>
                  <option value="last-year">Last Year</option>
                </select>
              </div>
              <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                Apply Filters
              </button>
            </div>
          </div>
          
          <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Map View</h2>
            <div className="h-[600px] relative">
              <DeckGL
                initialViewState={viewState}
                controller={true}
                layers={layers}
                onViewStateChange={evt => setViewState(evt.viewState)}
              >
                <StaticMap
                  mapStyle="mapbox://styles/mapbox/light-v11"
                  mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                />
              </DeckGL>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Government Activities</h2>
          <div className="space-y-4">
            {SAMPLE_DATA.map((story, index) => (
              <div key={index} className="border-b pb-4">
                <div className="flex justify-between">
                  <h3 className="font-medium">{story.title}</h3>
                  <span className={`text-sm px-2 py-1 rounded ${
                    story.level === 'Federal' ? 'bg-red-100 text-red-800' :
                    story.level === 'State' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {story.level}
                  </span>
                </div>
                <p className="text-gray-600 mt-1">Location: {story.position[1].toFixed(2)}, {story.position[0].toFixed(2)}</p>
                <p className="text-gray-500 text-sm mt-2">
                  Posted {new Date(story.timestamp).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 