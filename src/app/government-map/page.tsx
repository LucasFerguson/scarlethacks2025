// 'use client';

// import DashboardLayout from '@/components/DashboardLayout';

// export default function GovernmentMapPage() {
//   return (
//     <DashboardLayout>
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-3xl font-bold mb-6">Map of Government Activity</h1>
        
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-xl font-semibold mb-4">Filter Options</h2>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-gray-700 mb-2">Government Level</label>
//                 <select className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
//                   <option value="">All Levels</option>
//                   <option value="federal">Federal</option>
//                   <option value="state">State</option>
//                   <option value="local">Local</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-gray-700 mb-2">Policy Area</label>
//                 <select className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
//                   <option value="">All Areas</option>
//                   <option value="healthcare">Healthcare</option>
//                   <option value="education">Education</option>
//                   <option value="environment">Environment</option>
//                   <option value="economy">Economy</option>
//                   <option value="technology">Technology</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-gray-700 mb-2">Time Period</label>
//                 <select className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
//                   <option value="last-month">Last Month</option>
//                   <option value="last-3-months">Last 3 Months</option>
//                   <option value="last-6-months">Last 6 Months</option>
//                   <option value="last-year">Last Year</option>
//                 </select>
//               </div>
//               <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
//                 Apply Filters
//               </button>
//             </div>
//           </div>
          
//           <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-xl font-semibold mb-4">Map View</h2>
//             <div className="bg-gray-200 h-80 rounded-md flex items-center justify-center">
//               <p className="text-gray-500">Interactive map will be displayed here</p>
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h2 className="text-xl font-semibold mb-4">Recent Government Activities</h2>
//           <div className="space-y-4">
//             <div className="border-b pb-4">
//               <div className="flex justify-between">
//                 <h3 className="font-medium">New Healthcare Legislation</h3>
//                 <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">Federal</span>
//               </div>
//               <p className="text-gray-600 mt-1">New healthcare legislation passed in Congress aimed at improving access to mental health services.</p>
//               <p className="text-gray-500 text-sm mt-2">Posted 2 days ago</p>
//             </div>
//             <div className="border-b pb-4">
//               <div className="flex justify-between">
//                 <h3 className="font-medium">Environmental Protection Initiative</h3>
//                 <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">State</span>
//               </div>
//               <p className="text-gray-600 mt-1">State government announced new environmental protection initiatives to reduce carbon emissions.</p>
//               <p className="text-gray-500 text-sm mt-2">Posted 5 days ago</p>
//             </div>
//             <div>
//               <div className="flex justify-between">
//                 <h3 className="font-medium">Education Funding Program</h3>
//                 <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">Local</span>
//               </div>
//               <p className="text-gray-600 mt-1">Local school district implemented new funding program for STEM education.</p>
//               <p className="text-gray-500 text-sm mt-2">Posted 1 week ago</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// } 