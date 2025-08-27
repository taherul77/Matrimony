'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FiMenu, FiX, FiUser, FiHeart, FiSearch, FiLogOut, FiChevronDown, FiSettings, FiUsers, FiBarChart } from 'react-icons/fi';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Check if user is logged in
    const checkAuthStatus = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsLoggedIn(true);
      }
    };

    checkAuthStatus();
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    if (userDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userDropdownOpen]);

  const handleLogout = async () => {
    try {
      // Call logout API
      await fetch('/api/auth/logout', { method: 'POST' });
      
      // Clear local storage
      localStorage.removeItem('user');
      
      // Update state
      setIsLoggedIn(false);
      setUser(null);
      
      // Redirect to home
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <FiHeart className="text-white text-xl" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Perfect Pair
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-pink-500 transition-colors">
              Home
            </Link>
            <Link href="/search" className="text-gray-700 hover:text-pink-500 transition-colors">
              Search
            </Link>
            <Link href="/matches" className="text-gray-700 hover:text-pink-500 transition-colors">
              Matches
            </Link>
            <Link href="/profile" className="text-gray-700 hover:text-pink-500 transition-colors">
              Profile
            </Link>
            <Link href="/packages" className="text-gray-700 hover:text-pink-500 transition-colors">
              Packages
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-pink-500 transition-all duration-300 hover:scale-105 focus:outline-none"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                    <FiUser className="text-white text-sm" />
                  </div>
                  <span className="font-medium">
                    Welcome, {user.name}
                  </span>
                  <FiChevronDown className={`text-sm transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div ref={dropdownRef} className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      <p className="text-xs text-blue-600 font-medium mt-1">
                        {user.role === 'admin' ? 'Administrator' : 'User'}
                      </p>
                    </div>
                    
                    <div className="py-1">
                      <Link href="/dashboard" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <FiUser className="mr-3 h-4 w-4" />
                        Dashboard
                      </Link>
                      <Link href="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <FiSettings className="mr-3 h-4 w-4" />
                        My Profile
                      </Link>
                      <Link href="/matches" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <FiHeart className="mr-3 h-4 w-4" />
                        My Matches
                      </Link>
                      
                      {user.role === 'admin' && (
                        <>
                          <div className="border-t border-gray-100 my-1"></div>
                          <Link href="/admin" className="flex items-center px-4 py-2 text-sm text-blue-700 hover:bg-blue-50">
                            <FiBarChart className="mr-3 h-4 w-4" />
                            Admin Dashboard
                          </Link>
                          <Link href="/admin/users" className="flex items-center px-4 py-2 text-sm text-blue-700 hover:bg-blue-50">
                            <FiUsers className="mr-3 h-4 w-4" />
                            Manage Users
                          </Link>
                          <Link href="/admin/interests" className="flex items-center px-4 py-2 text-sm text-blue-700 hover:bg-blue-50">
                            <FiHeart className="mr-3 h-4 w-4" />
                            Manage Interests
                          </Link>
                        </>
                      )}
                    </div>
                    
                    <div className="border-t border-gray-100 pt-1">
                      <button 
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                      >
                        <FiLogOut className="mr-3 h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login">
                  <button className="text-gray-700 hover:text-pink-500 transition-all duration-300 hover:scale-105 font-medium">
                    Login
                  </button>
                </Link>
                <Link href="/register">
                  <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold transform hover:-translate-y-0.5">
                    Join Now
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700 hover:text-pink-500 transition-colors"
          >
            {isOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-700 hover:text-pink-500 transition-colors">
                Home
              </Link>
              <Link href="/search" className="text-gray-700 hover:text-pink-500 transition-colors">
                Search
              </Link>
              <Link href="/matches" className="text-gray-700 hover:text-pink-500 transition-colors">
                Matches
              </Link>
              <Link href="/profile" className="text-gray-700 hover:text-pink-500 transition-colors">
                Profile
              </Link>
              <Link href="/packages" className="text-gray-700 hover:text-pink-500 transition-colors">
                Packages
              </Link>
              
              {isLoggedIn && user ? (
                <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                      <FiUser className="text-white text-sm" />
                    </div>
                    <span className="text-gray-700 font-medium">
                      Welcome, {user.name}
                    </span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left flex items-center space-x-2 text-gray-700 hover:text-pink-500 transition-all duration-300 hover:scale-105 py-2"
                  >
                    <FiLogOut className="text-sm" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
                  <Link href="/login">
                    <button className="w-full text-left text-gray-700 hover:text-pink-500 transition-all duration-300 hover:scale-105 font-medium py-2">
                      Login
                    </button>
                  </Link>
                  <Link href="/register">
                    <button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold transform hover:-translate-y-0.5">
                      Join Now
                    </button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
