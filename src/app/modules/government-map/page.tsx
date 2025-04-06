'use client';

import { useEffect, useRef, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';

// Set your Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

interface Location {
  id: number;
  name: string;
  position: [number, number];
  type: string;
  contact: string;
  focus?: string;
  hours?: string;
}

interface NewsStory {
  id: number;
  title: string;
  position: [number, number];
  date: string;
  description: string;
  source: string;
  category: string;
  upvotes: number;
  downvotes: number;
}

const CHICAGO_COORDINATES: [number, number] = [-87.6298, 41.8781]; // Chicago center
const ENVIRONMENTAL_AGENCIES: Location[] = [
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
  {
    id: 4,
    name: 'Little Village Environmental Justice Organization (LVEJO)',
    position: [-87.6946, 41.8475],
    type: 'Nonprofit',
    contact: '(773) 762-6991',
    focus: 'Environmental Justice & Community Health',
  },
  {
    id: 5,
    name: 'Friends of the Parks',
    position: [-87.6243, 41.8818],
    type: 'Nonprofit',
    contact: '(312) 857-2757',
    focus: 'Park Advocacy & Environmental Sustainability',
  },
  {
    id: 6,
    name: 'Blacks in Green (BIG)',
    position: [-87.6050, 41.7800],
    type: 'Nonprofit',
    contact: 'hello@blacksingreen.org',
    focus: 'Sustainable Development in African American Communities',
  },
  {
    id: 7,
    name: 'Illinois Environmental Council (IEC)',
    position: [-87.6319, 41.8832],
    type: 'Advocacy Group',
    contact: '(217) 544-5954',
    focus: 'Environmental Policy & Advocacy',
  },
  {
    id: 8,
    name: 'Neighbors for Environmental Justice (N4EJ)',
    position: [-87.6762, 41.8316],
    type: 'Community-Based Organization',
    contact: '(312) N/A', // Placeholder for additional info
    focus: 'Community Organizing & Pollution Prevention',
  },
  {
    id: 9,
    name: "Chicago Central DMV",
    position: [-87.6315, 41.8842],
    type: "DMV",
    contact: "(312) 793-1010",
    hours: "Monday–Friday, 8:00–5:00"
  },
  {
    id: 10,
    name: "Chicago North DMV",
    position: [-87.7592, 41.9730],
    type: "DMV",
    contact: "(312) 793-1010",
    hours: "Monday–Friday, 8:30–5:30"
  },
  {
    id: 11,
    name: "Chicago South DMV",
    position: [-87.6133, 41.7164],
    type: "DMV",
    contact: "(312) 793-1010",
    hours: "Monday–Friday, 8:30–5:00"
  },
  {
    id: 12,
    name: "Chicago Public Service Center",
    position: [-87.6283, 41.8821],
    type: "DMV",
    contact: "(312) 793-1010",
    hours: "Monday–Friday, 8:30–5:00"
  },
  {
    id: 13,
    name: "Englewood Community Service Center (DFSS)",
    position: [-87.6487, 41.7506],
    type: "Community Services",
    contact: "(312) 747-0200",
    focus: "Family and Support Services"
  },
  {
    id: 14,
    name: "Garfield Community Service Center (DFSS)",
    position: [-87.7051, 41.8813],
    type: "Community Services",
    contact: "(312) 746-5400",
    focus: "Family and Support Services"
  },
  {
    id: 15,
    name: "North Area Community Service Center (DFSS)",
    position: [-87.6547, 41.9654],
    type: "Community Services",
    contact: "(312) 744-2580",
    focus: "Family and Support Services"
  },
  {
    id: 16,
    name: "311 City Services",
    position: [-87.6879, 41.8735],
    type: "City Services",
    contact: "(311)",
    focus:"Non-emergency services like pothole repair or graffiti removal."
  }
];

const NEWS_STORIES: NewsStory[] = [
  {
    id: 1,
    title: "Proposed Highway Expansion Threatens Pilsen Homes",
    position: [-87.6567, 41.8565], // Pilsen neighborhood
    date: "2024-02-20",
    description: "Residents protest against proposed highway expansion that would displace over 200 families in Pilsen.",
    source: "Chicago Tribune",
    category: "Urban Development",
    upvotes: 0,
    downvotes: 0
  },
  {
    id: 2,
    title: "Englewood Residents Fight Against New Industrial Zone",
    position: [-87.6450, 41.7750], // Englewood
    date: "2024-02-18",
    description: "Community members organize against city's plan to convert residential area into industrial zone.",
    source: "Block Club Chicago",
    category: "Community Impact",
    upvotes: 0,
    downvotes: 0
  },
  {
    id: 3,
    title: "Controversial High-Rise Development in Logan Square",
    position: [-87.7086, 41.9234], // Logan Square
    date: "2024-02-15",
    description: "Proposed 30-story building faces opposition from local residents concerned about gentrification.",
    source: "Chicago Sun-Times",
    category: "Development",
    upvotes: 0,
    downvotes: 0
  },
  {
    id: 4,
    title: "South Side Residents Protest New Waste Facility",
    position: [-87.6500, 41.7000], // South Side
    date: "2024-02-12",
    description: "Community groups demand environmental impact study for proposed waste processing plant.",
    source: "South Side Weekly",
    category: "Environmental Justice",
    upvotes: 0,
    downvotes: 0
  },
  {
    id: 5,
    title: "City Council Approves Controversial TIF District",
    position: [-87.6324, 41.8786], // City Hall
    date: "2024-02-10",
    description: "New TIF district approved despite community concerns about displacement and rising property taxes.",
    source: "Chicago Government News",
    category: "Policy",
    upvotes: 0,
    downvotes: 0
  },
  {
    id: 6,
    title: "West Side Residents Challenge New Stadium Proposal",
    position: [-87.7000, 41.9000], // West Side
    date: "2024-02-08",
    description: "Local community groups file lawsuit against city's approval of new sports complex.",
    source: "Chicago Defender",
    category: "Development",
    upvotes: 0,
    downvotes: 0
  },
  {
    id: 7,
    title: "North Side Park Land Sale Sparks Outrage",
    position: [-87.6500, 41.9500], // North Side
    date: "2024-02-05",
    description: "City's plan to sell public park land to private developer faces strong community opposition.",
    source: "Chicago Reader",
    category: "Public Space",
    upvotes: 0,
    downvotes: 0
  },
  {
    id: 8,
    title: "Bridgeport Residents Fight Against New Industrial Complex",
    position: [-87.6500, 41.8300], // Bridgeport
    date: "2024-02-03",
    description: "Proposed industrial development threatens historic neighborhood character, residents say.",
    source: "Chicago Tribune",
    category: "Development",
    upvotes: 0,
    downvotes: 0
  },
  {
    id: 9,
    title: "Uptown Community Divided Over New Transit Hub",
    position: [-87.6500, 41.9700], // Uptown
    date: "2024-02-01",
    description: "Proposed transit center raises concerns about increased traffic and noise pollution.",
    source: "Chicago Sun-Times",
    category: "Transportation",
    upvotes: 0,
    downvotes: 0
  },
  {
    id: 10,
    title: "South Shore Residents Challenge New Development Plan",
    position: [-87.5800, 41.7600], // South Shore
    date: "2024-01-28",
    description: "Community groups demand more affordable housing in proposed lakefront development.",
    source: "Chicago Reporter",
    category: "Housing",
    upvotes: 0,
    downvotes: 0
  }
];

export default function ChicagoMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedStory, setSelectedStory] = useState<NewsStory | null>(null);
  const [activeTab, setActiveTab] = useState<'locations' | 'stories'>('locations');
  const [stories, setStories] = useState<NewsStory[]>(NEWS_STORIES);

  const handleVote = (storyId: number, type: 'upvote' | 'downvote') => {
    setStories(prevStories => 
      prevStories.map(story => 
        story.id === storyId 
          ? { 
              ...story, 
              upvotes: type === 'upvote' ? story.upvotes + 1 : story.upvotes,
              downvotes: type === 'downvote' ? story.downvotes + 1 : story.downvotes
            }
          : story
      )
    );
  };

  // Initialize the Mapbox map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const mapInstance = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: CHICAGO_COORDINATES,
      zoom: 10,
    });

    // Add markers for government locations
    ENVIRONMENTAL_AGENCIES.forEach((location) => {
      const markerElement = document.createElement('div');
      markerElement.className = 'marker';
      markerElement.style.width = '36px';
      markerElement.style.height = '36px';
      markerElement.style.backgroundImage = 'url(/office-building-icon-32.png)';
      markerElement.style.backgroundSize = 'cover';
      markerElement.style.borderRadius = '0';
      markerElement.style.cursor = 'pointer';

      markerElement.addEventListener('click', () => {
        setSelectedLocation(location);
        setSelectedStory(null);
      });

      new mapboxgl.Marker(markerElement)
        .setLngLat(location.position)
        .addTo(mapInstance);
    });

    // Add markers for news stories
    NEWS_STORIES.forEach((story) => {
      const markerElement = document.createElement('div');
      markerElement.className = 'marker';
      markerElement.style.width = '24px';
      markerElement.style.height = '24px';
      markerElement.style.backgroundColor = '#ff6b6b';
      markerElement.style.borderRadius = '50%';
      markerElement.style.cursor = 'pointer';

      markerElement.addEventListener('click', () => {
        setSelectedStory(story);
        setSelectedLocation(null);
      });

      new mapboxgl.Marker(markerElement)
        .setLngLat(story.position)
        .addTo(mapInstance);
    });

    setMap(mapInstance);

    return () => mapInstance.remove();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Chicago Government & News Map</h1>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'locations'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setActiveTab('locations')}
        >
          Government Locations
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'stories'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setActiveTab('stories')}
        >
          News Stories
        </button>
      </div>

      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-[600px] rounded-lg shadow-lg" />

      {/* Popup for selected location */}
      {selectedLocation && (
        <div className="fixed bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 z-50 max-w-sm">
          <div className="space-y-2">
            <h3 className="font-bold text-lg">{selectedLocation.name}</h3>
            <p><strong>Type:</strong> {selectedLocation.type}</p>
            {selectedLocation.focus && <p><strong>Focus:</strong> {selectedLocation.focus}</p>}
            <p><strong>Contact:</strong> {selectedLocation.contact}</p>
            {selectedLocation.hours && <p><strong>Hours:</strong> {selectedLocation.hours}</p>}
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
              onClick={() => setSelectedLocation(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Popup for selected news story */}
      {selectedStory && (
        <div className="fixed bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 z-50 max-w-sm">
          <div className="space-y-2">
            <h3 className="font-bold text-lg">{selectedStory.title}</h3>
            <p className="text-sm text-gray-600">{selectedStory.date}</p>
            <p>{selectedStory.description}</p>
            <p className="text-sm"><strong>Source:</strong> {selectedStory.source}</p>
            <p className="text-sm"><strong>Category:</strong> {selectedStory.category}</p>
            <div className="flex items-center space-x-4 mt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleVote(selectedStory.id, 'upvote');
                }}
                className="flex items-center space-x-1 text-green-600 hover:text-green-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                <span>{selectedStory.upvotes}</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleVote(selectedStory.id, 'downvote');
                }}
                className="flex items-center space-x-1 text-red-600 hover:text-red-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span>{selectedStory.downvotes}</span>
              </button>
            </div>
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
              onClick={() => setSelectedStory(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* List of Locations or Stories */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">
          {activeTab === 'locations' ? 'Government Locations' : 'Recent News Stories'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeTab === 'locations' ? (
            ENVIRONMENTAL_AGENCIES.map((location) => (
              <div
                key={location.id}
                className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setSelectedLocation(location)}
              >
                <h3 className="font-medium">{location.name}</h3>
                <p className="text-sm text-black mt-1">{location.type}</p>
              </div>
            ))
          ) : (
            stories.map((story) => (
              <div
                key={story.id}
                className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setSelectedStory(story)}
              >
                <h3 className="font-medium">{story.title}</h3>
                <p className="text-sm text-black mt-1">{story.date}</p>
                <p className="text-sm text-black mt-1">{story.category}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVote(story.id, 'upvote');
                    }}
                    className="flex items-center space-x-1 text-green-600 hover:text-green-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    <span>{story.upvotes}</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVote(story.id, 'downvote');
                    }}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span>{story.downvotes}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
