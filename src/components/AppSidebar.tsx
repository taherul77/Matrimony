import React from "react";
import { useSidebar } from "../context/SidebarContext";
import { FiHome, FiUser, FiSearch, FiHeart, FiUsers, FiBarChart, FiSettings } from "react-icons/fi";
import Link from "next/link";

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, toggleMobileSidebar } = useSidebar();
  const [role, setRole] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setRole(user.role || 'user');
        } catch {}
      }
    }
  }, []);

  const userMenu = [
    { label: "Dashboard", icon: FiHome, href: "/dashboard" },
    { label: "My Profile", icon: FiUser, href: "/dashboard/profile" },
    { label: "Search", icon: FiSearch, href: "/search" },
    { label: "Matches", icon: FiHeart, href: "/matches" },
  ];
  const adminMenu = [
    { label: "Admin Dashboard", icon: FiBarChart, href: "/admin" },
    { label: "Manage Users", icon: FiUsers, href: "/admin/users" },
    { label: "Manage Interests", icon: FiHeart, href: "/admin/interests" },
    { label: "Settings", icon: FiSettings, href: "/admin/settings" },
  ];
  const menuItems = role === 'admin' ? adminMenu : userMenu;
  return (
    <aside
      className={`fixed top-0 left-0 h-full z-50 bg-white border-r border-gray-200 shadow-lg transition-all duration-300
        ${isExpanded ? "w-[290px]" : "w-[90px]"} ${isMobileOpen ? "block" : "hidden"} lg:block`}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 pt-16 space-y-2">
          {menuItems.map((item) => (
            <Link key={item.label} href={item.href} className="flex items-center px-4 py-3 hover:bg-gray-100 rounded-lg">
              <item.icon className="w-5 h-5 mr-3" />
              {isExpanded && <span>{item.label}</span>}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
};
export default AppSidebar;
