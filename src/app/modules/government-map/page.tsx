'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Marker, Popup } from 'react-map-gl'; // Import Marker and Popup
import 'mapbox-gl/dist/mapbox-gl.css';

const Map = dynamic(
  () => import('react-map-gl/mapbox').then((mod) => mod.Map),
  { ssr: false }
);

const CHICAGO_VIEW_STATE = {
  longitude: -87.6298,  // Chicago coordinates
  latitude: 41.8781,
  zoom: 10
};

const ENVIRONMENTAL_AGENCIES = [
  {
    id: 1,
    name: 'Chicago Department of Public Health',
    position: [-87.6298, 41.8781],
    type: 'Government',
    contact: '(312) 747-9884',
    focus: 'Environmental Health & Safety'
  },
  {
    id: 2,
    name: 'MWRD Industrial Waste Division',
    position: [-87.6337, 41.8775],
    type: 'Water Management',
    contact: '(312) 751-5123',
    focus: 'Wastewater Treatment'
  },
  {
    id: 3,
    name: 'Illinois EPA Chicago Office',
    position: [-87.6319, 41.8832],
    type: 'State Agency',
    contact: '(312) 814-3117',
    focus: 'Environmental Regulation'
  }
];

export default function ChicagoEnvironmentMap() {
  const [viewState, setViewState] = useState(CHICAGO_VIEW_STATE);
  const [selectedAgency, setSelectedAgency] = useState(null);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Chicago Environmental Agencies</h1>

        <div className="h-[600px] relative bg-white rounded-lg shadow-md">
          <Map
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
            {...viewState}
            onMove={evt => setViewState(evt.viewState)}
            mapStyle="mapbox://styles/mapbox/streets-v12"
          >
            {ENVIRONMENTAL_AGENCIES.map((agency) => (
              <div key={agency.id}>
                <Marker
                  longitude={agency.position[0]}
                  latitude={agency.position[1]}
                  onClick={() => setSelectedAgency(agency)}
                >
                  <div className="w-8 h-8 bg-green-600 rounded-full border-2 border-white shadow-lg cursor-pointer" />
                </Marker>

                {selectedAgency?.id === agency.id && (
                  <Popup
                    longitude={agency.position[0]}
                    latitude={agency.position[1]}
                    onClose={() => setSelectedAgency(null)}
                    anchor="bottom"
                  >
                    <div className="p-4 min-w-[250px]">
                      <h3 className="font-bold text-lg mb-2">{agency.name}</h3>
                      <div className="space-y-1">
                        <p><span className="font-semibold">Type:</span> {agency.type}</p>
                        <p><span className="font-semibold">Focus Area:</span> {agency.focus}</p>
                        <p><span className="font-semibold">Contact:</span> {agency.contact}</p>
                      </div>
                    </div>
                  </Popup>
                )}
              </div>
            ))}
          </Map>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Featured Agencies</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ENVIRONMENTAL_AGENCIES.map((agency) => (
              <div
                key={agency.id}
                className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedAgency(agency)}
              >
                <h3 className="font-medium">{agency.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{agency.type}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
