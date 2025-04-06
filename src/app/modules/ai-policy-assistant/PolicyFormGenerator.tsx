'use client';

import { useState } from 'react';
import { FaSpinner, FaCheck } from 'react-icons/fa';

interface FormField {
  label: string;
  type: string;
  options?: string[];
}

interface PolicyForm {
  program_name: string;
  fields: FormField[];
}

interface PolicyFormGeneratorProps {
  formData: PolicyForm;
  onSubmit: (formData: Record<string, string>) => void;
}

export default function PolicyFormGenerator({ formData, onSubmit }: PolicyFormGeneratorProps) {
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create an application object
      const application = {
        id: `APP-${Date.now()}`,
        policyName: formData.program_name,
        applicationDate: new Date().toISOString(),
        status: 'Applied', // Set status to 'Applied' to appear in the Applied Applications section
        description: `Application for ${formData.program_name}`,
        formData: formValues
      };
      
      // Save to localStorage
      const existingApplications = JSON.parse(localStorage.getItem('policyApplications') || '[]');
      localStorage.setItem('policyApplications', JSON.stringify([...existingApplications, application]));
      
      // Call the onSubmit callback with the form data
      onSubmit(formValues);
      
      // Show success message
      setSubmissionSuccess(true);
      
      console.log('Application submitted:', application);
    } catch (err) {
      console.error('Error submitting form:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submissionSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="flex justify-center mb-4">
          <FaCheck className="text-4xl text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-green-800 mb-2">Application Submitted Successfully!</h3>
        <p className="text-gray-800 mb-4">
          Your application for {formData.program_name} has been submitted. You can check the status of your application in the Policy Application Status page.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-blue-800 mb-4">{formData.program_name} Application Form</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {formData.fields.map((field, index) => (
          <div key={index}>
            <label htmlFor={field.label} className="block text-sm font-medium text-gray-800 mb-1">
              {field.label}
            </label>
            
            {field.type === 'text' && (
              <input
                type="text"
                id={field.label}
                name={field.label}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                value={formValues[field.label] || ''}
                onChange={handleInputChange}
              />
            )}
            
            {field.type === 'date' && (
              <input
                type="date"
                id={field.label}
                name={field.label}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                value={formValues[field.label] || ''}
                onChange={handleInputChange}
              />
            )}
            
            {field.type === 'number' && (
              <input
                type="number"
                id={field.label}
                name={field.label}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                value={formValues[field.label] || ''}
                onChange={handleInputChange}
              />
            )}
            
            {field.type === 'dropdown' && field.options && (
              <select
                id={field.label}
                name={field.label}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                value={formValues[field.label] || ''}
                onChange={handleInputChange}
              >
                <option value="">Select {field.label}</option>
                {field.options.map((option, optionIndex) => (
                  <option key={optionIndex} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
            
            {field.type === 'radio' && field.options && (
              <div className="flex space-x-4">
                {field.options.map((option, optionIndex) => (
                  <label key={optionIndex} className="flex items-center">
                    <input
                      type="radio"
                      name={field.label}
                      value={option}
                      required
                      className="mr-2"
                      checked={formValues[field.label] === option}
                      onChange={handleInputChange}
                    />
                    <span className="text-gray-800">{option}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
        
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-blue-700 text-white px-6 py-2 rounded-md hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              'Submit Application'
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 