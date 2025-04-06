'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PolicyFormGenerator from '../../PolicyFormGenerator';

// Sample policy forms data
const samplePolicyForms: Record<string, {
  program_name: string;
  fields: Array<{
    label: string;
    type: string;
    options?: string[];
  }>;
}> = {
  'snap': {
    program_name: 'SNAP (Food Assistance)',
    fields: [
      { label: 'Full Name', type: 'text' },
      { label: 'Date of Birth', type: 'date' },
      { label: 'Social Security Number', type: 'text' },
      { label: 'Address', type: 'text' },
      { label: 'City', type: 'text' },
      { label: 'State', type: 'text' },
      { label: 'ZIP Code', type: 'text' },
      { label: 'Phone Number', type: 'text' },
      { label: 'Email', type: 'text' },
      { label: 'Household Size', type: 'number' },
      { label: 'Monthly Income', type: 'number' },
      { label: 'Employment Status', type: 'dropdown', options: ['Employed', 'Unemployed', 'Self-Employed', 'Retired', 'Disabled'] },
      { label: 'Are you a U.S. citizen?', type: 'radio', options: ['Yes', 'No'] }
    ]
  },
  'medicaid': {
    program_name: 'Medicaid',
    fields: [
      { label: 'Full Name', type: 'text' },
      { label: 'Date of Birth', type: 'date' },
      { label: 'Social Security Number', type: 'text' },
      { label: 'Address', type: 'text' },
      { label: 'City', type: 'text' },
      { label: 'State', type: 'text' },
      { label: 'ZIP Code', type: 'text' },
      { label: 'Phone Number', type: 'text' },
      { label: 'Email', type: 'text' },
      { label: 'Household Size', type: 'number' },
      { label: 'Monthly Income', type: 'number' },
      { label: 'Employment Status', type: 'dropdown', options: ['Employed', 'Unemployed', 'Self-Employed', 'Retired', 'Disabled'] },
      { label: 'Do you have health insurance?', type: 'radio', options: ['Yes', 'No'] },
      { label: 'Are you pregnant?', type: 'radio', options: ['Yes', 'No'] },
      { label: 'Do you have any disabilities?', type: 'radio', options: ['Yes', 'No'] }
    ]
  }
};

export default function PolicyFormPage() {
  const params = useParams();
  const policyId = params.policyId as string;
  const [formData, setFormData] = useState<typeof samplePolicyForms[keyof typeof samplePolicyForms] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Simulate fetching form data based on policyId
    const fetchFormData = async () => {
      try {
        setLoading(true);
        // In a real application, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (policyId in samplePolicyForms) {
          setFormData(samplePolicyForms[policyId]);
        } else {
          setError('Policy form not found');
        }
      } catch (err) {
        setError('Failed to load form data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, [policyId]);

  const handleFormSubmit = (formValues: Record<string, string>) => {
    if (!formData) return;
    
    // Create an application object
    const application = {
      id: `APP-${Date.now()}`,
      policyName: formData.program_name,
      applicationDate: new Date().toISOString(),
      status: 'Applied',
      description: `Application for ${formData.program_name}`,
      formData: formValues
    };

    // Save to localStorage
    const existingApplications = JSON.parse(localStorage.getItem('policyApplications') || '[]');
    localStorage.setItem('policyApplications', JSON.stringify([...existingApplications, application]));

    console.log('Application submitted:', application);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold text-red-800 mb-2">Error</h3>
          <p className="text-gray-800">{error}</p>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold text-yellow-800 mb-2">No Form Data</h3>
          <p className="text-gray-800">No form data was found for this policy.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PolicyFormGenerator 
        formData={formData} 
        onSubmit={handleFormSubmit} 
      />
    </div>
  );
} 