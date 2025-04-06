'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useState, useEffect } from 'react';
import { fetchGovernmentPolicies, GovernmentPolicy } from '@/services/policyService';

export default function PolicyOpinionPage() {
  const [activeTab, setActiveTab] = useState('submit');
  const [policies, setPolicies] = useState<GovernmentPolicy[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState({
    level: 'all',
    status: 'all',
    category: 'all'
  });

  useEffect(() => {
    if (activeTab === 'policies') {
      loadPolicies();
    }
  }, [activeTab]);

  const loadPolicies = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedPolicies = await fetchGovernmentPolicies();
      setPolicies(fetchedPolicies);
    } catch (err) {
      console.error('Error loading policies:', err);
      setError('Failed to load government policies from the API. Showing sample data instead.');
      // The service will return mock data if the API fails, so we don't need to set policies here
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = (policyId: string) => {
    setPolicies(prevPolicies => 
      prevPolicies.map(policy => 
        policy.id === policyId 
          ? { ...policy, upvotes: policy.upvotes + 1 } 
          : policy
      )
    );
  };

  const handleDownvote = (policyId: string) => {
    setPolicies(prevPolicies => 
      prevPolicies.map(policy => 
        policy.id === policyId 
          ? { ...policy, downvotes: policy.downvotes + 1 } 
          : policy
      )
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Proposed':
        return 'bg-yellow-100 text-yellow-800';
      case 'In Committee':
        return 'bg-blue-100 text-blue-800';
      case 'Passed':
        return 'bg-green-100 text-green-800';
      case 'Vetoed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Federal':
        return 'bg-blue-100 text-blue-800';
      case 'State':
        return 'bg-purple-100 text-purple-800';
      case 'Local':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPolicies = policies.filter(policy => {
    if (filter.level !== 'all' && policy.level !== filter.level) return false;
    if (filter.status !== 'all' && policy.status !== filter.status) return false;
    if (filter.category !== 'all' && policy.category !== filter.category) return false;
    return true;
  });

  const uniqueCategories = [...new Set(policies.map(p => p.category))];
  const uniqueLevels = [...new Set(policies.map(p => p.level))];
  const uniqueStatuses = [...new Set(policies.map(p => p.status))];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Policy Opinion</h1>
        
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('submit')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'submit'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Submit Opinion
              </button>
              <button
                onClick={() => setActiveTab('policies')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'policies'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                New Government Policies
              </button>
              <button
                onClick={() => setActiveTab('recent')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'recent'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Recent Opinions
              </button>
            </nav>
          </div>
        </div>
        
        {activeTab === 'submit' && (
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
        )}
        
        {activeTab === 'policies' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">New Government Policies</h2>
              <button 
                onClick={loadPolicies}
                className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Refreshing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    Refresh
                  </>
                )}
              </button>
            </div>
            
            {error && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Filters */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Government Level</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={filter.level}
                  onChange={(e) => setFilter({...filter, level: e.target.value})}
                >
                  <option value="all">All Levels</option>
                  {uniqueLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={filter.status}
                  onChange={(e) => setFilter({...filter, status: e.target.value})}
                >
                  <option value="all">All Statuses</option>
                  {uniqueStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={filter.category}
                  onChange={(e) => setFilter({...filter, category: e.target.value})}
                >
                  <option value="all">All Categories</option>
                  {uniqueCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {loading && policies.length === 0 ? (
              <div className="flex justify-center items-center py-12">
                <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : filteredPolicies.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No government policies found matching your filters.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPolicies.map(policy => (
                  <div key={policy.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{policy.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{policy.description}</p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <div className="flex items-center">
                          <button 
                            onClick={() => handleUpvote(policy.id)}
                            className="bg-green-100 text-green-800 px-3 py-1 rounded-md text-sm font-medium hover:bg-green-200 transition-colors"
                          >
                            Upvote ({policy.upvotes})
                          </button>
                        </div>
                        <div className="flex items-center">
                          <button 
                            onClick={() => handleDownvote(policy.id)}
                            className="bg-red-100 text-red-800 px-3 py-1 rounded-md text-sm font-medium hover:bg-red-200 transition-colors"
                          >
                            Downvote ({policy.downvotes})
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(policy.level)}`}>
                        {policy.level}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(policy.status)}`}>
                        {policy.status}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {policy.category}
                      </span>
                    </div>
                    <div className="mt-4 text-sm text-gray-500">
                      <p>Introduced: {formatDate(policy.introducedDate)}</p>
                      {policy.sponsor && <p>Sponsor: {policy.sponsor}</p>}
                      {policy.lastUpdated && <p>Last Updated: {formatDate(policy.lastUpdated)}</p>}
                      {policy.url && (
                        <a 
                          href={policy.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-800 mt-2 inline-block"
                        >
                          View Official Bill →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'recent' && (
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
        )}
      </div>
    </DashboardLayout>
  );
} 