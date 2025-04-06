'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { FaRobot, FaLink, FaTimes, FaSpinner } from 'react-icons/fa';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formUrl: string;
  title: string;
}

const FormModal: React.FC<FormModalProps> = ({ isOpen, onClose, formUrl, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-11/12 max-w-4xl h-5/6 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={24} />
          </button>
        </div>
        <div className="flex-1 p-4">
          <iframe
            src={formUrl}
            className="w-full h-full border-0"
            title={title}
          />
        </div>
      </div>
    </div>
  );
};

export default function AIPolicyAssistantPage() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    formUrl: string;
    title: string;
  }>({
    isOpen: false,
    formUrl: '',
    title: ''
  });

  const handleSubmit = async () => {
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    setIsLoading(true);
    setError('');
    setAnswer(''); // Clear previous answer while loading

    try {
      const response = await fetch(`https://gta-backend.onrender.com/query?question=${encodeURIComponent(question)}`);
      const data = await response.json();
      
      if (data.answer) {
        setAnswer(data.answer);
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

  const handleProgramClick = (formUrl: string, title: string) => {
    setModalState({
      isOpen: true,
      formUrl,
      title
    });
  };

  // Function to format the answer with clickable program sections
  const formatAnswer = (text: string) => {
    // Split the text into paragraphs
    const paragraphs = text.split('\n').filter(p => p.trim());
    
    return paragraphs.map((paragraph, index) => {
      // Check if paragraph contains a program with form link
      const programMatch = paragraph.match(/(\d+\.\s*.*?):\s*(.*?)\s*Form Link:\s*\[(.*?)\]\((.*?)\)/);
      
      if (programMatch) {
        const [_, number, title, description, linkText, formUrl] = programMatch;
        
        return (
          <div 
            key={index}
            className="mb-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
            onClick={() => handleProgramClick(formUrl, title)}
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
            <a 
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              <FaLink className="mr-1" />
              {linkText}
            </a>
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
          {answer && !isLoading && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <FaRobot className="text-2xl text-indigo-600 mr-2" />
                <h2 className="text-xl font-semibold text-indigo-700">AI Assistant Response</h2>
              </div>
              <div className="prose max-w-none">
                {formatAnswer(answer)}
              </div>
            </div>
          )}
        </div>

        {/* Form Modal */}
        <FormModal
          isOpen={modalState.isOpen}
          onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
          formUrl={modalState.formUrl}
          title={modalState.title}
        />
      </div>
    </DashboardLayout>
  );
} 