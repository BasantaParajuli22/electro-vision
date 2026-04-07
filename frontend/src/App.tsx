import { Routes, Route } from 'react-router-dom';
import Header from './components/home/Header';
import Footer from './components/home/Footer';
import { useAuth } from './context/AuthContext';
import AllCardsPage from './pages/AllCardsPage';
import CardDetailPage from './pages/CardDetailPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import CheckoutReturnPage from './pages/CheckoutReturnPage';
import CartPage from './pages/CartPage';
import { Toaster } from 'sonner'
import SignInPage from './pages/account/SignInPage';
import SignUpPage from './pages/account/SignUpPage';
import HomePage from './pages/HomePage';
import SupportLegalPage from './pages/SupportLegalPage';



// A simple spinner component for loading states
const FullPageSpinner = () => (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
);


function App() {
  const { isLoading } = useAuth();

  // Show a loading spinner while we verify the user's session
  if (isLoading) {
    return <FullPageSpinner />;
  }
  
  return (
    <div className="bg-white">
    <Toaster position="top-center" expand={true} richColors />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/support" element={<SupportLegalPage />} />
          <Route path="/login" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/products" element={<AllCardsPage />} />
          <Route path="/products/:id" element={<CardDetailPage />} />
          <Route path="/order-history" element={<OrderHistoryPage />} />
          <Route path="/cart" element={<CartPage />} />
           <Route path="/payment-success" element={<CheckoutReturnPage status="success" />} />
          <Route path="/payment-cancelled" element={<CheckoutReturnPage status="cancelled" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}



export default App;