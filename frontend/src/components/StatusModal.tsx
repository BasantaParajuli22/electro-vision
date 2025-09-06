import React, { useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation within the modal

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: 'success' | 'cancelled';
  isGiftCardOrder?: boolean; 
}

// Success Icon SVG
const CheckIcon = () => (
  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

// Cancelled Icon SVG
const XIcon = () => (
  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const StatusModal: React.FC<StatusModalProps> = ({ isOpen, onClose, status, isGiftCardOrder = false }) => {
  const isSuccess = status === 'success';

  // Effect to handle the Escape key press to close the modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      // Backdrop
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      onClick={onClose}
    >
      <div
        // Modal Content
        className="relative w-full max-w-sm rounded-lg bg-white p-6 text-center shadow-xl"
        onClick={(e) => e.stopPropagation()} // Prevents modal from closing when clicking inside
      >
        <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${isSuccess ? 'bg-green-100' : 'bg-red-100'}`}>
          {isSuccess ? <CheckIcon /> : <XIcon />}
        </div>
        
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          {isSuccess ? 'Payment Successful' : 'Payment Cancelled'}
        </h3>
        
        <p className="mt-2 text-sm text-gray-500">
          {isSuccess
            ? 'Thank you! Your order has been confirmed and is being processed.'
            : 'Your payment was not processed. You have not been charged.'}
        </p>

        {isSuccess && isGiftCardOrder && (
          <p className="mt-3 text-sm font-semibold text-indigo-700">
            Please check your inbox (and spam folder)!
            You can also view your order details in your <Link to="/order-history" className="text-indigo-600 hover:underline">Order History</Link>.
          </p>
        )}

        <button
          onClick={onClose}
          className="mt-6 inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
        >
          {isSuccess ? 'Continue Browsing' : 'Try Again'}
        </button>
      </div>
    </div>
  );
};

export default StatusModal;