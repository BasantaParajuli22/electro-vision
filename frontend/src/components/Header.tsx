import { Link, NavLink } from 'react-router-dom';
import { LogOut, ShoppingCart } from 'lucide-react'; // Changed icon
import { useAuth } from '../context/AuthContext';


const Header = () => {
  const { isAuthenticated, user, logout, isLoading } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
    }
  };

  const activeLinkStyle = {
    color: '#4f46e5',
    fontWeight: '600',
  };

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
           <img
            src="/headLogo.svg"
            alt="ElectroVision Logo"
            className="h-12 w-auto"   
          />
          {/* <span className="text-2xl font-bold text-gray-800">ElectroVision</span>  */}
        </Link>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink
            to="/"
            className="text-gray-600 hover:text-indigo-600 transition-colors"
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
          >
            Home
          </NavLink>
          <NavLink
            to="/products" // Changed link
            className="text-gray-600 hover:text-indigo-600 transition-colors"
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
          >
            Products
          </NavLink>
        </nav>

        {/* Right side: Auth/User Actions */}
        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
          ) : isAuthenticated && user ? (
            // -- LOGGED IN STATE --
            <div className="flex items-center gap-4">
               <NavLink
                to="/cart"
                className="p-2 text-gray-600 hover:text-indigo-600"
                title="Your Cart"
              >
                <ShoppingCart className="h-6 w-6" />
              </NavLink>
              <NavLink
                to="/order-history"
                className="text-gray-600 hover:text-indigo-600 font-semibold transition-colors hidden lg:block"
              >
                My Orders
              </NavLink>
              <span className="font-semibold text-gray-700 hidden sm:block">
                {user.displayName.split(' ')[0]}
              </span>
              <img
                src={user.avatar}
                alt="User Avatar"
                className="h-10 w-10 rounded-full border-2 border-indigo-200"
              />
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            // -- LOGGED OUT STATE --
            <>
              <NavLink
                to="/cart"
                className="p-2 text-gray-600 hover:text-indigo-600"
                title="Your Cart"
              >
                <ShoppingCart className="h-6 w-6" />
              </NavLink>
              <Link
                to="/login"
                className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-shadow shadow-sm hover:shadow-md"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};


export default Header;