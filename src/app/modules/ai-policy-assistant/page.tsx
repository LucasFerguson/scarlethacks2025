'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { FaRobot, FaLink, FaTimes, FaSpinner, FaCheck, FaFileAlt } from 'react-icons/fa';

interface AssistanceProgram {
  title: string;
  description: string;
  formUrl: string;
}

interface ExternalLink {
  title: string;
  url: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  additionalInfo: string;
}

export default function AIPolicyAssistantPage() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentForm, setCurrentForm] = useState<AssistanceProgram | null>(null);
  const [currentLink, setCurrentLink] = useState<ExternalLink | null>(null);
  const [showFormFields, setShowFormFields] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    additionalInfo: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [extractedPolicies, setExtractedPolicies] = useState<AssistanceProgram[]>([]);

  const handleSubmit = async () => {
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    setIsLoading(true);
    setError('');
    setAnswer(''); // Clear previous answer while loading
    setCurrentForm(null); // Clear any displayed form
    setCurrentLink(null); // Clear any displayed link
    setExtractedPolicies([]); // Clear extracted policies
    
    try {
      const response = await fetch(`https://gta-backend.onrender.com/query?question=${encodeURIComponent(question)}`);
      const data = await response.json();
      
      if (data.answer) {
        setAnswer(data.answer);
        // Extract policies from the answer
        const policies = extractPoliciesFromAnswer(data.answer);
        setExtractedPolicies(policies);
      } else {
        setError('No answer received from the server');
      }
    } catch (err) {
      setError('Failed to get response from the server');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const extractPoliciesFromAnswer = (text: string): AssistanceProgram[] => {
    const policies: AssistanceProgram[] = [];
    
    // Split the text into paragraphs
    const paragraphs = text.split('\n').filter(p => p.trim());
    
    paragraphs.forEach(paragraph => {
      // Check if paragraph contains a program with form link
      if (paragraph.includes('Application') && paragraph.includes('Click to access the form')) {
        // Extract program details
        const lines = paragraph.split('\n');
        const title = lines[0].trim();
        const description = lines.slice(1, -2).join(' ').trim();
        const formUrl = 'https://example.com/forms/' + title.toLowerCase().replace(/\s+/g, '-');
        
        policies.push({ title, description, formUrl });
      }
      
      // Check if paragraph contains a numbered program with form link
      const programMatch = paragraph.match(/(\d+)\.\s*(.*?):\s*(.*?)\s*You can apply using this form:\s*(.*?)Form\)/);
      if (programMatch) {
        const [_, number, title, description, formName] = programMatch;
        const formUrl = 'https://example.com/forms/' + formName.toLowerCase().replace(/\s+/g, '-');
        
        policies.push({ title, description, formUrl });
      }
    });
    
    return policies;
  };

  const handleFormClick = (program: AssistanceProgram) => {
    setCurrentForm(program);
    setCurrentLink(null);
    setShowFormFields(true);
    setSubmissionSuccess(false);
  };

  const handleLinkClick = (link: ExternalLink) => {
    setCurrentLink(link);
    setCurrentForm(null);
  };

  const closeForm = () => {
    setCurrentForm(null);
    setShowFormFields(false);
    setSubmissionSuccess(false);
  };

  const closeLink = () => {
    setCurrentLink(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentForm) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create application object
      const application = {
        id: Date.now().toString(),
        policyName: currentForm.title,
        applicationDate: new Date().toISOString().split('T')[0],
        status: 'pending',
        description: `Application submitted for ${currentForm.title}. We will review your application and get back to you soon.`,
        formData: { ...formData }
      };
      
      // Get existing applications from localStorage
      const existingApplications = JSON.parse(localStorage.getItem('policyApplications') || '[]');
      
      // Add new application
      const updatedApplications = [...existingApplications, application];
      
      // Save to localStorage
      localStorage.setItem('policyApplications', JSON.stringify(updatedApplications));
      
      // Show success message
      setSubmissionSuccess(true);
      
      // Reset form data
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        additionalInfo: ''
      });
      
    } catch (err) {
      setError('Failed to submit application');
      console.error('Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickSubmit = (policy: AssistanceProgram) => {
    // Create application object
    const application = {
      id: Date.now().toString(),
      policyName: policy.title,
      applicationDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      description: `Application submitted for ${policy.title}. We will review your application and get back to you soon.`,
      formData: {
        name: 'Quick Submit',
        email: 'user@example.com',
        phone: 'N/A',
        address: 'N/A',
        additionalInfo: 'Submitted via quick submit'
      }
    };
    
    // Get existing applications from localStorage
    const existingApplications = JSON.parse(localStorage.getItem('policyApplications') || '[]');
    
    // Add new application
    const updatedApplications = [...existingApplications, application];
    
    // Save to localStorage
    localStorage.setItem('policyApplications', JSON.stringify(updatedApplications));
    
    // Show success message
    alert(`Application for ${policy.title} has been submitted successfully! You can check the status in the Policy Application Status page.`);
  };

  // Function to format the answer with clickable program sections
  const formatAnswer = (text: string) => {
    // Split the text into paragraphs
    const paragraphs = text.split('\n').filter(p => p.trim());
    
    return paragraphs.map((paragraph, index) => {
      // Check if paragraph contains a program with form link
      if (paragraph.includes('Application') && paragraph.includes('Click to access the form')) {
        // Extract program details
        const lines = paragraph.split('\n');
        const title = lines[0].trim();
        const description = lines.slice(1, -2).join(' ').trim();
        const formUrl = 'https://example.com/forms/' + title.toLowerCase().replace(/\s+/g, '-');
        
        return (
          <div 
            key={index} 
            className="mb-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
            onClick={() => handleFormClick({ title, description, formUrl })}
          >
            <div className="flex items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-indigo-600 mb-2">{title}</h3>
                <p className="text-gray-700">{description}</p>
                <div className="mt-2 text-sm text-indigo-500 flex items-center">
                  <FaLink className="mr-1" />
                  Click to access the form
                </div>
              </div>
            </div>
          </div>
        );
      }
      
      // Check if paragraph contains a numbered program with form link
      const programMatch = paragraph.match(/(\d+)\.\s*(.*?):\s*(.*?)\s*You can apply using this form:\s*(.*?)Form\)/);
      if (programMatch) {
        const [_, number, title, description, formName] = programMatch;
        const formUrl = 'https://example.com/forms/' + formName.toLowerCase().replace(/\s+/g, '-');
        
        return (
          <div 
            key={index} 
            className="mb-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
            onClick={() => handleFormClick({ title, description, formUrl })}
          >
            <div className="flex items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-indigo-600 mb-2">{title}</h3>
                <p className="text-gray-700">{description}</p>
                <div className="mt-2 text-sm text-indigo-500 flex items-center">
                  <FaLink className="mr-1" />
                  Click to access the form
                </div>
              </div>
            </div>
          </div>
        );
      }
      
      // Check if paragraph contains a regular link
      const linkMatch = paragraph.match(/\[(.*?)\]\((.*?)\)/);
      if (linkMatch) {
        const [fullMatch, linkText, linkUrl] = linkMatch;
        const parts = paragraph.split(fullMatch);
        
        return (
          <div key={index} className="mb-4 last:mb-0 text-gray-700">
            {parts[0]}
            <button 
              onClick={() => handleLinkClick({ title: linkText, url: linkUrl })}
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              <FaLink className="mr-1" />
              {linkText}
            </button>
            {parts[1]}
          </div>
        );
      }
      
      return (
        <div key={index} className="mb-4 last:mb-0 text-gray-700">
          {paragraph}
        </div>
      );
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 text-indigo-800">AI Policy Assistant</h1>
          <p className="text-gray-600">
            Ask questions about government policies and assistance programs. Our AI assistant will help you find relevant information and resources.
          </p>
        </div>
        
        <div className="space-y-6">
          {/* AI Assistant Input Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-indigo-700">Ask Your Question</h2>
            <div className="mb-4">
              <textarea 
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={4}
                placeholder="Ask about government policies, assistance programs, or eligibility requirements..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              ></textarea>
            </div>
            {error && (
              <div className="text-red-500 mb-4">{error}</div>
            )}
            <button 
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Getting Answer...' : 'Submit Question'}
            </button>
          </div>

          {/* Loading Indicator */}
          {isLoading && (
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center">
              <FaSpinner className="text-4xl text-indigo-600 animate-spin mb-4" />
              <p className="text-indigo-600 font-medium">Fetching information from AI assistant...</p>
            </div>
          )}
          
          {/* AI Assistant Output Section */}
          {answer && !isLoading && !currentForm && !currentLink && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <FaRobot className="text-2xl text-indigo-600 mr-2" />
                <h2 className="text-xl font-semibold text-indigo-700">AI Assistant Response</h2>
              </div>
              <div className="prose max-w-none">
                {formatAnswer(answer)}
              </div>
              
              {/* Quick Submit Section */}
              {extractedPolicies.length > 0 && (
                <div className="mt-8 border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-indigo-700 mb-4">Quick Submit Applications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {extractedPolicies.map((policy, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <h4 className="text-md font-semibold text-indigo-600 mb-2">{policy.title}</h4>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{policy.description}</p>
                        <button
                          onClick={() => handleQuickSubmit(policy)}
                          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm flex items-center"
                        >
                          <FaFileAlt className="mr-2" />
                          Submit Application
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Form Display Section */}
          {currentForm && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <FaRobot className="text-2xl text-indigo-600 mr-2" />
                  <h2 className="text-xl font-semibold text-indigo-700">{currentForm.title}</h2>
                </div>
                <button 
                  onClick={closeForm}
                  className="text-gray-500 hover:text-gray-700 flex items-center"
                >
                  <FaTimes className="mr-1" />
                  Back to Answer
                </button>
              </div>
              <div className="mb-4">
                <p className="text-gray-700">{currentForm.description}</p>
              </div>
              
              {submissionSuccess ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <FaCheck className="text-4xl text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-green-700 mb-2">Application Submitted Successfully!</h3>
                  <p className="text-gray-700 mb-4">
                    Your application for {currentForm.title} has been submitted. You can check the status of your application in the Policy Application Status page.
                  </p>
                  <button
                    onClick={closeForm}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  {showFormFields ? (
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          required
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          required
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          value={formData.address}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-1">Additional Information</label>
                        <textarea
                          id="additionalInfo"
                          name="additionalInfo"
                          rows={3}
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          value={formData.additionalInfo}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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
                  ) : (
                    <div className="h-[600px] border border-gray-200 rounded-md overflow-hidden">
                      <iframe 
                        src={currentForm.formUrl} 
                        className="w-full h-full border-0"
                        title={`${currentForm.title} Application Form`}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* External Link Display Section */}
          {currentLink && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <FaRobot className="text-2xl text-indigo-600 mr-2" />
                  <h2 className="text-xl font-semibold text-indigo-700">{currentLink.title}</h2>
                </div>
                <button 
                  onClick={closeLink}
                  className="text-gray-500 hover:text-gray-700 flex items-center"
                >
                  <FaTimes className="mr-1" />
                  Back to Answer
                </button>
              </div>
              <div className="h-[600px] border border-gray-200 rounded-md overflow-hidden">
                <iframe 
                  src={currentLink.url} 
                  className="w-full h-full border-0"
                  title={currentLink.title}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 