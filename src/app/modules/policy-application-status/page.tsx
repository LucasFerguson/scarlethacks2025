'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { FaSearch, FaClock, FaCheckCircle, FaTimesCircle, FaFileAlt } from 'react-icons/fa';

interface Application {
  id: string;
  policyName: string;
  applicationDate: string;
  status: 'approved' | 'pending' | 'rejected' | 'Applied';
  description: string;
  formData?: {
    name: string;
    email: string;
    phone: string;
    address: string;
    additionalInfo: string;
  };
}

type ApplicationFilter = 'all' | 'pending' | 'approved' | 'rejected' | 'Applied';

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
        return <FaTimesCircle className="text-red-500 text-xl" />;
      case 'Applied':
        return <FaFileAlt className="text-blue-500 text-xl" />;
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
      case 'Applied':
        return 'Applied';
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
      case 'Applied':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 text-blue-900">Policy Application Status</h1>
          <p className="text-gray-800">
            Track the status of your policy applications and view their details.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <button
            onClick={() => fetchApplications('all')}
            className={`p-4 rounded-lg border-2 transition-all ${
              activeFilter === 'all'
                ? 'border-blue-700 bg-blue-50 text-blue-900'
                : 'border-gray-200 hover:border-blue-500 text-gray-800'
            }`}
          >
            <div className="flex flex-col items-center">
              <FaFileAlt className="text-2xl mb-2 text-blue-700" />
              <span className="font-medium">All Applications</span>
            </div>
          </button>
          
          <button
            onClick={() => fetchApplications('Applied')}
            className={`p-4 rounded-lg border-2 transition-all ${
              activeFilter === 'Applied'
                ? 'border-blue-700 bg-blue-50 text-blue-900'
                : 'border-gray-200 hover:border-blue-500 text-gray-800'
            }`}
          >
            <div className="flex flex-col items-center">
              <FaFileAlt className="text-2xl mb-2 text-blue-700" />
              <span className="font-medium">Applied Applications</span>
            </div>
          </button>
          
          <button
            onClick={() => fetchApplications('pending')}
            className={`p-4 rounded-lg border-2 transition-all ${
              activeFilter === 'pending'
                ? 'border-yellow-700 bg-yellow-50 text-yellow-900'
                : 'border-gray-200 hover:border-yellow-500 text-gray-800'
            }`}
          >
            <div className="flex flex-col items-center">
              <FaClock className="text-2xl mb-2 text-yellow-700" />
              <span className="font-medium">Pending Applications</span>
            </div>
          </button>
          
          <button
            onClick={() => fetchApplications('approved')}
            className={`p-4 rounded-lg border-2 transition-all ${
              activeFilter === 'approved'
                ? 'border-green-700 bg-green-50 text-green-900'
                : 'border-gray-200 hover:border-green-500 text-gray-800'
            }`}
          >
            <div className="flex flex-col items-center">
              <FaCheckCircle className="text-2xl mb-2 text-green-700" />
              <span className="font-medium">Approved Applications</span>
            </div>
          </button>
          
          <button
            onClick={() => fetchApplications('rejected')}
            className={`p-4 rounded-lg border-2 transition-all ${
              activeFilter === 'rejected'
                ? 'border-red-700 bg-red-50 text-red-900'
                : 'border-gray-200 hover:border-red-500 text-gray-800'
            }`}
          >
            <div className="flex flex-col items-center">
              <FaTimesCircle className="text-2xl mb-2 text-red-700" />
              <span className="font-medium">Rejected Applications</span>
            </div>
          </button>
        </div>
        
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
            <p className="text-blue-800 font-medium">Loading applications...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            {error}
          </div>
        )}
        
        {!isLoading && !error && (
          <div className="space-y-4">
            {applications.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-800">No applications found for this category.</p>
              </div>
            ) : (
              applications.map((application) => (
                <div
                  key={application.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900 mb-1">
                        {application.policyName}
                      </h3>
                      <p className="text-sm text-gray-800">
                        Application Date: {new Date(application.applicationDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(application.status)}`}>
                      {getStatusText(application.status)}
                    </div>
                  </div>
                  
                  <p className="text-gray-800 mb-4">{application.description}</p>

                  {application.formData && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-semibold text-blue-800 mb-3">Application Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-700">Name: <span className="text-gray-900">{application.formData.name}</span></p>
                          <p className="text-sm text-gray-700">Email: <span className="text-gray-900">{application.formData.email}</span></p>
                          <p className="text-sm text-gray-700">Phone: <span className="text-gray-900">{application.formData.phone}</span></p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-700">Address: <span className="text-gray-900">{application.formData.address}</span></p>
                          {application.formData.additionalInfo && (
                            <p className="text-sm text-gray-700">Additional Info: <span className="text-gray-900">{application.formData.additionalInfo}</span></p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 