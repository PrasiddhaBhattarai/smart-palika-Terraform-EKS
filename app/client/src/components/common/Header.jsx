import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';
import {
  FiHome,
  FiAlertTriangle,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
  FiSettings,
  FiFilter,
  FiChevronDown,
  FiLogIn,
  FiSearch
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const navigation = user?.role?.includes('admin')
    ? [
        { name: 'Admin Dashboard', href: '/admin', icon: FiSettings },
        { name: 'Complaints Management', href: '/admin/complaints', icon: FiFilter }
      ]
    : user
    ? [
        { name: 'Dashboard', href: '/dashboard', icon: FiHome },
        { name: 'My Complaints', href: '/complaints', icon: FiAlertTriangle },
        { name: 'Search Complaints', href: '/search-complaints', icon: FiSearch }
      ]
    : [];

  // Function to truncate long names
  const truncateName = (name, maxLength = 15) => {
    if (!name) return '';
    return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="bg-gradient-to-br from-nepal-blue to-nepal-red p-1.5 rounded-xl shadow-md group-hover:shadow-lg transition-shadow">
              <img src={logo} alt="Smart Palika Logo" className="h-8 w-8 object-contain" />
            </div>
            <span className="ml-3 text-xl font-bold text-nepal-blue group-hover:text-nepal-red transition-colors">
              Smart Palika
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item, index) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center px-4 py-2 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-nepal-blue transition-all duration-300 font-medium group"
              >
                <item.icon className="h-5 w-5 mr-2 text-nepal-blue group-hover:text-nepal-red" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Menu - Desktop */}
          <div className="hidden md:flex items-center">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 bg-gray-50 hover:bg-blue-50 pl-4 pr-3 py-2 rounded-xl transition-colors duration-300 group"
                >
                  <div className="bg-gradient-to-br from-nepal-blue to-nepal-red p-2 rounded-full">
                    <FiUser className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-nepal-blue max-w-[120px] truncate">
                    {truncateName(user?.name || user?.role)}
                  </span>
                  <FiChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* User Dropdown */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50"
                      onMouseLeave={() => setIsUserMenuOpen(false)}
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 capitalize mt-1">{user?.role}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-nepal-blue transition-colors group"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FiUser className="h-4 w-4 mr-3 text-nepal-blue group-hover:text-nepal-red" />
                        Your Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-nepal-red transition-colors group"
                      >
                        <FiLogOut className="h-4 w-4 mr-3 text-gray-500 group-hover:text-nepal-red" />
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center px-4 py-2 rounded-xl bg-nepal-blue text-white hover:bg-blue-700 transition-all duration-300 font-medium group"
              >
                <FiLogIn className="h-5 w-5 mr-2" />
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-nepal-blue transition-colors"
            >
              {isMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-gray-100 overflow-hidden"
            >
              <div className="py-4 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-nepal-blue rounded-lg transition-colors mx-2 group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5 mr-3 text-nepal-blue group-hover:text-nepal-red" />
                    {item.name}
                  </Link>
                ))}
                
                {user ? (
                  <div className="pt-4 border-t border-gray-100 mx-4">
                    <div className="flex items-center px-2 py-3">
                      <div className="bg-gradient-to-br from-nepal-blue to-nepal-red p-2 rounded-full">
                        <FiUser className="h-4 w-4 text-white" />
                      </div>
                      <div className="ml-3 max-w-[calc(100%-3rem)]">
                        <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 capitalize mt-1">{user?.role}</p>
                      </div>
                    </div>
                    
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-nepal-blue rounded-lg transition-colors mt-2 group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FiUser className="h-5 w-5 mr-3 text-nepal-blue group-hover:text-nepal-red" />
                      Your Profile
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-nepal-red rounded-lg transition-colors mt-1 group"
                    >
                      <FiLogOut className="h-5 w-5 mr-3 text-gray-500 group-hover:text-nepal-red" />
                      Sign out
                    </button>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-gray-100 mx-4">
                    <Link
                      to="/login"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-nepal-blue rounded-lg transition-colors mt-2 group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FiLogIn className="h-5 w-5 mr-3 text-nepal-blue group-hover:text-nepal-red" />
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-nepal-blue rounded-lg transition-colors mt-1 group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FiUser className="h-5 w-5 mr-3 text-nepal-blue group-hover:text-nepal-red" />
                      Create Account
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;