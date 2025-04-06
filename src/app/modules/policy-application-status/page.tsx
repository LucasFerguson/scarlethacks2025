'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { FaSpinner, FaCheckCircle, FaClock, FaExclamationTriangle, FaFileAlt } from 'react-icons/fa';

interface Application {
  id: string;
  policyName: string;
  applicationDate: string;
  status: 'approved' | 'pending' | 'rejected';
  description: string;
  formData?: {
    name: string;
    email: string;
    phone: string;
    address: string;
    additionalInfo: string;
  };
}

type ApplicationFilter = 'all' | 'pending' | 'approved' | 'rejected';

export default function PolicyApplicationStatusPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState<ApplicationFilter>('all');

  const fetchApplications = async (filter: ApplicationFilter) => {
    setIsLoading(true);
    setError('');
    setApplications([]);
    setActiveFilter(filter);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get applications from localStorage
      const storedApplications = JSON.parse(localStorage.getItem('policyApplications') || '[]');
      
      // Filter applications based on selected filter
      let filteredApplications = [...storedApplications];
      if (filter !== 'all') {
        filteredApplications = storedApplications.filter((app: Application) => app.status === filter);
      }
      
      setApplications(filteredApplications);
    } catch (err) {
      setError('Failed to fetch application status');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load applications when component mounts
  useEffect(() => {
    fetchApplications('all');
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <FaCheckCircle className="text-green-500 text-xl" />;
      case 'pending':
        return <FaClock className="text-yellow-500 text-xl" />;
      case 'rejected':
        return <FaExclamationTriangle className="text-red-500 text-xl" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'pending':
        return 'Pending';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 text-indigo-800">Policy Application Status</h1>
          <p className="text-gray-600">
            View the status of your policy applications. Select a category to filter your applications.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-indigo-700">Application Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              className={`p-4 rounded-lg flex flex-col items-center justify-center transition-all ${
                activeFilter === 'all' 
                  ? 'bg-indigo-100 text-indigo-800 border-2 border-indigo-500' 
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
              onClick={() => fetchApplications('all')}
            >
              <FaFileAlt className="text-2xl mb-2" />
              <span className="font-medium">All Applications</span>
            </button>
            
            <button
              className={`p-4 rounded-lg flex flex-col items-center justify-center transition-all ${
                activeFilter === 'pending' 
                  ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-500' 
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
              onClick={() => fetchApplications('pending')}
            >
              <FaClock className="text-2xl mb-2" />
              <span className="font-medium">Applied Applications</span>
            </button>
            
            <button
              className={`p-4 rounded-lg flex flex-col items-center justify-center transition-all ${
                activeFilter === 'approved' 
                  ? 'bg-green-100 text-green-800 border-2 border-green-500' 
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
              onClick={() => fetchApplications('approved')}
            >
              <FaCheckCircle className="text-2xl mb-2" />
              <span className="font-medium">Approved Applications</span>
            </button>
            
            <button
              className={`p-4 rounded-lg flex flex-col items-center justify-center transition-all ${
                activeFilter === 'rejected' 
                  ? 'bg-red-100 text-red-800 border-2 border-red-500' 
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
              onClick={() => fetchApplications('rejected')}
            >
              <FaExclamationTriangle className="text-2xl mb-2" />
              <span className="font-medium">Rejected Applications</span>
            </button>
          </div>
          
          {error && (
            <div className="mt-4 text-red-500">{error}</div>
          )}
        </div>
        
        {isLoading && (
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center">
            <FaSpinner className="text-4xl text-indigo-600 animate-spin mb-4" />
            <p className="text-indigo-600 font-medium">Loading applications...</p>
          </div>
        )}
        
        {applications.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-indigo-700">
              {activeFilter === 'all' ? 'All Applications' : 
               activeFilter === 'pending' ? 'Applied Applications' :
               activeFilter === 'approved' ? 'Approved Applications' : 'Rejected Applications'}
            </h2>
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-indigo-600">{app.policyName}</h3>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getStatusClass(app.status)}`}>
                      {getStatusIcon(app.status)}
                      <span className="ml-1">{getStatusText(app.status)}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">
                    Application Date: {new Date(app.applicationDate).toLocaleDateString()}
                  </div>
                  <p className="text-gray-700">{app.description}</p>
                  
                  {app.formData && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Application Details:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="font-medium">Name:</span> {app.formData.name}
                        </div>
                        <div>
                          <span className="font-medium">Email:</span> {app.formData.email}
                        </div>
                        <div>
                          <span className="font-medium">Phone:</span> {app.formData.phone}
                        </div>
                        <div>
                          <span className="font-medium">Address:</span> {app.formData.address}
                        </div>
                        {app.formData.additionalInfo && (
                          <div className="col-span-2">
                            <span className="font-medium">Additional Info:</span> {app.formData.additionalInfo}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {!isLoading && applications.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600">No applications found in this category.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 