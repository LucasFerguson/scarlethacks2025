'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { name: 'AI Policy Assistant', path: '/modules/ai-policy-assistant' },
    { name: 'Policy Opinion', path: '/modules/policy-opinion' },
    { name: 'Map of Government Activity', path: '/modules/government-map' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <div 
      className={`bg-gray-800 text-white h-screen transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="p-4 flex justify-between items-center">
        {!isCollapsed && <h2 className="text-xl font-bold">Dashboard</h2>}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded hover:bg-gray-700"
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>
      
      <nav className="mt-8 flex-grow">
        <ul>
          {navItems.map((item) => (
            <li key={item.path} className="mb-2">
              <Link 
                href={item.path}
                className={`flex items-center p-3 ${
                  isActive(item.path) 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span className="ml-3">{isCollapsed ? item.name.charAt(0) : item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      {session && (
        <div className="p-4 mt-auto">
          <button
            onClick={() => signOut()}
            className={`w-full p-2 text-center bg-red-600 hover:bg-red-700 rounded text-sm ${
              isCollapsed ? 'px-1' : 'px-4'
            }`}
          >
            {isCollapsed ? 'X' : 'Sign Out'}
          </button>
        </div>
      )}
    </div>
  );
} 