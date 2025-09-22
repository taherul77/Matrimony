
import React, { useEffect, useState, useRef } from "react";
import { FiMenu, FiChevronDown, FiUser, FiLogOut } from "react-icons/fi";
import { useSidebar } from "../context/SidebarContext";
import { useRouter } from "next/navigation";

const AppHeader: React.FC = () => {
  const { toggleSidebar, toggleMobileSidebar } = useSidebar();
  const [user, setUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    
    // Clear session storage (instead of localStorage)
    sessionStorage.removeItem("user");
    
    // Clear localStorage as well (in case there's old data)
    localStorage.removeItem("user");
    
    // Clear user cookie
    document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    setUser(null);
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm py-2">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              if (window.innerWidth >= 1024) {
                toggleSidebar();
              } else {
                toggleMobileSidebar();
              }
            }}
            className="flex items-center justify-center w-10 h-10 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
            aria-label="Toggle Sidebar"
          >
            <FiMenu className="w-5 h-5" />
          </button>
          <span className="font-bold text-lg">Dashboard</span>
          <div className="hidden lg:block">
            <button  onClick={() => router.push("/")} className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all">
            
              <span className="font-medium">Home</span>
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {user && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                  <FiUser className="text-white text-sm" />
                </div>
                <span className="font-medium hidden md:block">{user.name}</span>
                <FiChevronDown className={`text-sm transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => router.push("/dashboard/profile")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <FiUser className="mr-3 h-4 w-4" />
                      My Profile
                    </button>
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
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
