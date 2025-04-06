'use client';

import DashboardLayout from '@/components/DashboardLayout';

export default function AIPolicyAssistantPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">AI Policy Assistant</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Ask a Policy Question</h2>
          <div className="mb-4">
            <textarea 
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={4}
              placeholder="Enter your policy question here..."
            ></textarea>
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
            Submit Question
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Questions</h2>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <p className="font-medium">What are the current regulations on AI in healthcare?</p>
              <p className="text-gray-600 text-sm mt-1">Asked 2 days ago</p>
            </div>
            <div className="border-b pb-4">
              <p className="font-medium">How does the EU AI Act affect small businesses?</p>
              <p className="text-gray-600 text-sm mt-1">Asked 5 days ago</p>
            </div>
            <div>
              <p className="font-medium">What are the ethical considerations for AI in autonomous vehicles?</p>
              <p className="text-gray-600 text-sm mt-1">Asked 1 week ago</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 