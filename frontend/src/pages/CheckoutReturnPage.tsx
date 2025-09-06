import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AllCardsPage from './AllCardsPage';
import StatusModal from '../components/StatusModal';

interface CheckoutReturnPageProps {
  status: 'success' | 'cancelled';
}

const CheckoutReturnPage: React.FC<CheckoutReturnPageProps> = ({ status }) => {
  const [showModal, setShowModal] = useState(true);
  const navigate = useNavigate();

  // CREATE a new handler function that does two things:
  // 1. Closes the modal.
  // 2. Navigates to the clean URL.
  const handleCloseAndNavigate = () => {
    setShowModal(false);
    // Now that the modal is closed, we clean up the URL.
    // This leaves the user on the correct page without the /payment-success in their history.
    navigate('/order-history', { replace: true });
  };

  return (
    <>
      {/* The AllCardsPage is still rendered in the background */}
      <AllCardsPage />

      <StatusModal
        isOpen={showModal}
        // UPDATE the onClose prop to use our new handler function.
        onClose={handleCloseAndNavigate}
        status={status}
        // MODIFIED: Pass this prop as true if the payment was a success.
        // This will trigger the special message in the modal.
        isGiftCardOrder={status === 'success'}
      />
    </>
  );
};

export default CheckoutReturnPage;