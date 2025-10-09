import React from "react";
import { useSidebar } from "../context/SidebarContext";
import { useUser } from "../context/UserContext";
import { 
  FiHome, 
  FiUser, 
  FiSearch, 
  FiHeart, 
  FiUsers, 
  FiBarChart, 
  FiSettings,
  FiPackage,
  FiMessageSquare,
  FiEye,
  FiStar,
  FiZap,
  FiCalendar,
  FiHeadphones,
  FiShield,
  FiTrendingUp,
  FiGift,
  FiAward,
  FiBell,
  FiCreditCard,
  FiActivity
} from "react-icons/fi";
import { FaCrown } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import Link from "next/link";
import { useBusinessLogic } from "../hooks/useBusinessLogic";
import { useClientOnly } from "../hooks/useClientOnly";

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, toggleMobileSidebar } = useSidebar();
  const { user, isLoading: userLoading } = useUser();
  const [currentPackage, setCurrentPackage] = React.useState<string>('free');
  const isClient = useClientOnly();
  
  const role = user?.role || 'user';
  const userId = user?.id;
  
  const { permissions, loading: permissionsLoading } = useBusinessLogic(userId);
  
  // Combined loading state
  const loading = userLoading || permissionsLoading;

  React.useEffect(() => {
    // You can fetch package info here if needed
    // For now, defaulting to 'free'
    setCurrentPackage('free');
  }, [user]);

  // Package badge component
  const PackageBadge = () => {
    const getBadgeConfig = () => {
      switch (currentPackage.toLowerCase()) {
        case 'vip':
        case 'elite':
          return { icon: FaCrown, color: 'text-yellow-500', bg: 'bg-gradient-to-r from-yellow-50 to-red-50', text: 'VIP' };
        case 'platinum':
          return { icon: HiSparkles, color: 'text-purple-500', bg: 'bg-purple-50', text: 'Platinum' };
        case 'gold':
          return { icon: FiStar, color: 'text-yellow-600', bg: 'bg-yellow-50', text: 'Gold' };
        case 'silver':
          return { icon: FiAward, color: 'text-blue-500', bg: 'bg-blue-50', text: 'Silver' };
        default:
          return { icon: FiGift, color: 'text-gray-500', bg: 'bg-gray-50', text: 'Free' };
      }
    };

    const badge = getBadgeConfig();
    const Icon = badge.icon;

    return (
      <div className={`mx-4 mb-4 p-3 rounded-lg ${badge.bg} border`}>
        <div className="flex items-center">
          <Icon className={`w-5 h-5 ${badge.color} mr-2`} />
          {isExpanded && (
            <div>
              <div className={`font-semibold text-sm ${badge.color}`}>{badge.text} Member</div>
              <div className="text-xs text-gray-500">Premium Features Available</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Menu item with permission check
  const MenuItem = ({ item, isSection = false }: { item: any; isSection?: boolean }) => {
    // Admin users have access to all routes, regular users need permission check
    const isDisabled = role !== 'admin' && item.requiresPermission && permissions && !(permissions as any)[item.requiresPermission];
    
    if (isSection) {
      return (
        <div className="px-4 py-2">
          {isExpanded && (
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {item.label}
            </h3>
          )}
        </div>
      );
    }

    return (
      <Link 
        key={item.label} 
        href={isDisabled ? '#' : item.href} 
        className={`flex items-center px-4 py-3 mx-2 rounded-lg transition-all duration-200 ${
          isDisabled 
            ? 'text-gray-400 cursor-not-allowed opacity-50' 
            : 'hover:bg-gray-100 text-gray-700 hover:text-blue-600'
        }`}
        onClick={isDisabled ? (e) => e.preventDefault() : undefined}
      >
        <div className="relative">
          <item.icon className="w-5 h-5 mr-3" />
          {item.badge && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
          {item.premium && role !== 'admin' && (
            <FaCrown className="absolute -top-1 -right-1 w-3 h-3 text-yellow-500" />
          )}
        </div>
        {isExpanded && (
          <div className="flex-1">
            <span className="font-medium">{item.label}</span>
            {item.subtitle && (
              <div className="text-xs text-gray-500">{item.subtitle}</div>
            )}
            {isDisabled && (
              <div className="text-xs text-red-500">Upgrade Required</div>
            )}
          </div>
        )}
        {isExpanded && item.count && (
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {item.count}
          </span>
        )}
      </Link>
    );
  };

  const userMenu = [
    // Main Navigation
    { type: 'section', label: 'Main' },
    { label: "Dashboard", icon: FiHome, href: "/dashboard", subtitle: "Overview & stats" },
    { label: "My Profile", icon: FiUser, href: "/dashboard/profile", subtitle: "Manage your profile" },
    
    // Matching & Search
    { type: 'section', label: 'Find Matches' },
    { label: "Search Profiles", icon: FiSearch, href: "/dashboard/search", subtitle: "Basic search" },
    { 
      label: "Advanced Search", 
      icon: FiZap, 
      href: "/dashboard/search/advanced", 
      subtitle: "Premium filters",
      premium: true,
      requiresPermission: 'hasAdvancedSearch'
    },
    { label: "My Matches", icon: FiHeart, href: "/dashboard/matches", subtitle: "Compatible profiles" },
    { 
      label: "Handpicked Matches", 
      icon: FaCrown, 
      href: "/dashboard/vip/handpicked-matches", 
      subtitle: "Curated by experts",
      premium: true,
      requiresPermission: 'hasHandpickedMatches'
    },
    
    // Communication
    { type: 'section', label: 'Communication' },
    { label: "Messages", icon: FiMessageSquare, href: "/dashboard/messages", subtitle: "Chat with matches" },
    { label: "Interests Sent", icon: FiHeart, href: "/dashboard/interests/sent", subtitle: "Track your interests" },
    { label: "Interests Received", icon: FiUsers, href: "/dashboard/interests/received", badge: true },
    
    // Premium Features
    { type: 'section', label: 'Premium Features' },
    { 
      label: "Profile Visitors", 
      icon: FiEye, 
      href: "/dashboard/profile/visitors", 
      subtitle: "See who viewed you",
      premium: true,
      requiresPermission: 'canViewProfileVisitors'
    },
    { 
      label: "Compatibility Analysis", 
      icon: FiActivity, 
      href: "/dashboard/compatibility", 
      subtitle: "AI-powered matching",
      premium: true,
      requiresPermission: 'hasCompatibilityTools'
    },
    { 
      label: "Featured Profiles", 
      icon: FiStar, 
      href: "/dashboard/featured", 
      subtitle: "Premium listings",
      premium: true,
      requiresPermission: 'isFeatured'
    },
    
    // VIP Exclusive
    { type: 'section', label: 'VIP Exclusive' },
    { 
      label: "VIP Dashboard", 
      icon: FaCrown, 
      href: "/dashboard/vip/dashboard", 
      subtitle: "Exclusive services",
      premium: true,
      requiresPermission: 'hasPersonalMatchmaker'
    },
    { 
      label: "Personal Matchmaker", 
      icon: FiUsers, 
      href: "/dashboard/vip/matchmaker", 
      subtitle: "Dedicated expert",
      premium: true,
      requiresPermission: 'hasPersonalMatchmaker'
    },
    // { 
    //   label: "Exclusive Events", 
    //   icon: FiCalendar, 
    //   href: "/dashboard/vip/events", 
    //   subtitle: "VIP meetups & webinars",
    //   premium: true,
    //   requiresPermission: 'hasEventAccess'
    // },
    // { 
    //   label: "Priority Support", 
    //   icon: FiHeadphones, 
    //   href: "/dashboard/vip/support", 
    //   subtitle: "24/7 assistance",
    //   premium: true,
    //   requiresPermission: 'hasPrioritySupport'
    // },
    
    // Account & Settings
    { type: 'section', label: 'Account' },
    // { label: "Privacy Settings", icon: FiShield, href: "/dashboard/settings/privacy" },
    // { label: "Notifications", icon: FiBell, href: "/dashboard/settings/notifications", badge: true },
    { label: "Subscription", icon: FiCreditCard, href: "/dashboard/packages", subtitle: "Manage your plan" },
    // { label: "Settings", icon: FiSettings, href: "/dashboard/settings" },
  ];

  const adminMenu = [
    // Administration Section
    { type: 'section', label: 'Administration' },
    { label: "Admin Dashboard", icon: FiBarChart, href: "/admin", subtitle: "System overview" },
    { label: "Analytics", icon: FiTrendingUp, href: "/admin/analytics", subtitle: "Business metrics" },
    
    // User Management
    { type: 'section', label: 'User Management' },
    { label: "Manage Users", icon: FiUsers, href: "/admin/users", subtitle: "All user accounts" },
    { label: "User Verification", icon: FiShield, href: "/admin/verification", badge: true },
    { label: "Profile Moderation", icon: FiEye, href: "/admin/moderation" },
    
    // Package Management
    { type: 'section', label: 'Packages & Billing' },
    { label: "Manage Packages", icon: FiPackage, href: "/admin/packages", subtitle: "Pricing & features" },
    { label: "Subscriptions", icon: FiCreditCard, href: "/admin/subscriptions" },
    { label: "Revenue Reports", icon: FiTrendingUp, href: "/admin/revenue" },
    
    // Content Management
    { type: 'section', label: 'Content & Features' },
    { label: "Manage Interests", icon: FiHeart, href: "/admin/interests" },
    { label: "VIP Services", icon: FaCrown, href: "/admin/vip-services", subtitle: "Matchmaker tools" },
    { label: "Events Management", icon: FiCalendar, href: "/admin/events" },
    { label: "Support Tickets", icon: FiHeadphones, href: "/admin/support", badge: true },
    
    // System Settings
    { type: 'section', label: 'System Settings' },
    { label: "Platform Settings", icon: FiSettings, href: "/admin/settings" },
    { label: "Admin Notifications", icon: FiBell, href: "/admin/notifications" },
  ];

  // For admin users, combine both user and admin menus
  const combinedAdminMenu = role === 'admin' ? [...userMenu, ...adminMenu] : userMenu;
  const menuItems = role === 'admin' ? combinedAdminMenu : userMenu;

  // Don't render until client is ready to prevent hydration mismatches
  if (!isClient || loading) {
    return (
      <aside className={`fixed top-0 left-0 h-full z-50 bg-white border-r border-gray-200 shadow-lg transition-all duration-300 ${isExpanded ? "w-[290px]" : "w-[90px]"} ${isMobileOpen ? "block" : "hidden"} lg:block`}>
        <div className="flex flex-col h-full">
          <div className="flex-1 pt-16 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={`fixed top-0 left-0 h-full z-50 bg-white border-r border-gray-200 shadow-lg transition-all duration-300
        ${isExpanded ? "w-[290px]" : "w-[90px]"} ${isMobileOpen ? "block" : "hidden"} lg:block`}
    >
      <div className="flex flex-col h-full">
        {/* Package Badge */}
        <div className="pt-16 pb-2">
          <PackageBadge />
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto">
          <nav className="space-y-1 pb-4">
            {menuItems.map((item, index) => (
              <div key={`${item.type || 'menu'}-${item.label}-${index}`}>
                {item.type === 'section' ? (
                  <MenuItem item={item} isSection={true} />
                ) : (
                  <MenuItem item={item} />
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Upgrade CTA for non-VIP users (but not for admin) */}
        {role !== 'admin' && currentPackage !== 'vip' && currentPackage !== 'elite' && isExpanded && (
          <div className="p-4 border-t">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <FaCrown className="w-5 h-5 mr-2" />
                <span className="font-semibold">Upgrade to VIP</span>
              </div>
              <p className="text-sm opacity-90 mb-3">
                Get personal matchmaker, exclusive events, and priority support
              </p>
              <Link 
                href="/packages" 
                className="block w-full bg-white text-purple-600 text-center py-2 rounded-md font-medium text-sm hover:bg-gray-100 transition-colors"
              >
                View Plans
              </Link>
            </div>
          </div>
        )}

        {/* Footer */}
        {isExpanded && (
          <div className="p-4 border-t bg-gray-50">
            <div className="text-center">
              <p className="text-xs text-gray-500">
                © 2025 Matrimony Platform
              </p>
              <p className="text-xs text-gray-400">
                Powered by AI Matching
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
export default AppSidebar;
