'use client';

import DashboardLayout from '@/components/DashboardLayout';

export default function PolicyOpinionPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Policy Opinion</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Submit a Policy Opinion</h2>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Policy Topic</label>
            <input 
              type="text" 
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter policy topic..."
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Your Opinion</label>
            <textarea 
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={6}
              placeholder="Share your opinion on this policy..."
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Supporting Evidence (Optional)</label>
            <textarea 
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={4}
              placeholder="Add any supporting evidence or references..."
            ></textarea>
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
            Submit Opinion
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Opinions</h2>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="font-medium">Data Privacy Regulations</h3>
              <p className="text-gray-600 mt-1">The current data privacy regulations need to be strengthened to protect consumer rights in the digital age.</p>
              <p className="text-gray-500 text-sm mt-2">Submitted 3 days ago</p>
            </div>
            <div className="border-b pb-4">
              <h3 className="font-medium">Climate Change Policy</h3>
              <p className="text-gray-600 mt-1">We should implement more aggressive carbon reduction targets to combat climate change effectively.</p>
              <p className="text-gray-500 text-sm mt-2">Submitted 1 week ago</p>
            </div>
            <div>
              <h3 className="font-medium">Education Reform</h3>
              <p className="text-gray-600 mt-1">The education system needs to focus more on critical thinking and problem-solving skills.</p>
              <p className="text-gray-500 text-sm mt-2">Submitted 2 weeks ago</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 