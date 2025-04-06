import React from 'react';
import { IoClose } from 'react-icons/io5';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  formUrl: string;
}

const FormModal: React.FC<FormModalProps> = ({ isOpen, onClose, title, formUrl }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-4xl h-5/6 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">{title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <IoClose size={24} />
          </button>
        </div>
        <div className="flex-1 p-4 overflow-hidden">
          <iframe 
            src={formUrl} 
            className="w-full h-full border-0"
            title={`${title} Application Form`}
          />
        </div>
      </div>
    </div>
  );
};

export default FormModal; 