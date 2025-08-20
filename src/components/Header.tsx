'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiMenu, FiX, FiUser, FiHeart, FiSearch, FiLogOut } from 'react-icons/fi';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Demo: simulate logged in user

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
              Matrimony
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
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                  <FiUser className="text-white text-sm" />
                </div>
                <button className="flex items-center space-x-2 text-gray-700 hover:text-pink-500 transition-all duration-300 hover:scale-105">
                  <FiLogOut className="text-sm" />
                  <span>Logout</span>
                </button>
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
              {!isLoggedIn && (
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
