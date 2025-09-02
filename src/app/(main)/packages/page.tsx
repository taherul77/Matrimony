"use client";
import React, { useEffect, useState, useCallback } from "react";
import { FiCheck, FiStar, FiAward, FiGift } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";
import { PackageComparison } from '@/components';

interface Package {
  id: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
  maxPhotos: number;
  maxInterests: number;
  canMessage: boolean;
  canViewContacts: boolean;
  priorityLevel: number;
  isActive: boolean;
}

const PackagesPage = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [purchasing, setPurchasing] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string>("");
  const [showComparison, setShowComparison] = useState(false);
  const [currentUserPackage, setCurrentUserPackage] = useState("free");

  const fetchPackages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/packages");
      if (!res.ok) throw new Error("Failed to fetch packages");
      const data = await res.json();
      
      if (data.packages && data.packages.length > 0) {
        setPackages(data.packages);
      } else {
        // If no packages exist, seed them
        await seedPackages();
      }
    } catch (err) {
      setError("Failed to load packages");
      console.error("Error fetching packages:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const seedPackages = async () => {
    try {
      const response = await fetch("/api/seed/packages", { method: "POST" });
      if (response.ok) {
        const data = await response.json();
        setPackages(data.packages || []);
      }
    } catch (error) {
      console.error("Error seeding packages:", error);
    }
  };

  const fetchCurrentUserPackage = useCallback(async () => {
    try {
      const res = await fetch("/api/me");
      if (res.ok) {
        const userData = await res.json();
        if (userData.user?.currentPackage) {
          setCurrentUserPackage(userData.user.currentPackage);
        }
      }
    } catch (error) {
      console.error("Error fetching user package:", error);
    }
  }, []);

  useEffect(() => {
    fetchPackages();
    fetchCurrentUserPackage();
  }, [fetchPackages, fetchCurrentUserPackage]);

  const handleSelectPlan = async (packageId: string) => {
    setPurchasing(true);
    setSelectedPackage(packageId);
    
    try {
      // In a real app, you would get the current user ID from auth context
      const userId = "current-user-id"; // Replace with actual user ID
      
      const response = await fetch("/api/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          packageId
        }),
      });

      if (response.ok) {
        alert("Plan selected successfully!");
        // Redirect to dashboard or payment page
        window.location.href = "/dashboard";
      } else {
        const error = await response.json();
        alert(error.error || "Failed to select plan");
      }
    } catch (error) {
      console.error("Failed to select plan:", error);
      alert("Failed to select plan");
    } finally {
      setPurchasing(false);
      setSelectedPackage("");
    }
  };

  const getPackageIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "free": return <FiGift className="w-8 h-8" />;
      case "silver": return <FiStar className="w-8 h-8" />;
      case "gold": return <FiAward className="w-8 h-8" />;
      case "platinum": return <HiSparkles className="w-8 h-8" />;
      case "vip": return <HiSparkles className="w-8 h-8" />;
      default: return <FiGift className="w-8 h-8" />;
    }
  };

  const getPackageColor = (name: string) => {
    switch (name.toLowerCase()) {
      case "free": return {
        card: "border-gray-300 bg-white hover:border-gray-400",
        button: "bg-gray-600 hover:bg-gray-700",
        badge: "bg-gray-100 text-gray-800",
        icon: "text-gray-500"
      };
      case "silver": return {
        card: "border-gray-400 bg-gradient-to-br from-gray-50 to-gray-100 hover:border-gray-500",
        button: "bg-gray-600 hover:bg-gray-700",
        badge: "bg-gray-100 text-gray-800",
        icon: "text-gray-600"
      };
      case "gold": return {
        card: "border-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100 hover:border-yellow-500 shadow-lg",
        button: "bg-yellow-600 hover:bg-yellow-700",
        badge: "bg-yellow-100 text-yellow-800",
        icon: "text-yellow-600"
      };
      case "platinum": return {
        card: "border-purple-400 bg-gradient-to-br from-purple-50 to-purple-100 hover:border-purple-500",
        button: "bg-purple-600 hover:bg-purple-700",
        badge: "bg-purple-100 text-purple-800",
        icon: "text-purple-600"
      };
      case "vip": return {
        card: "border-red-400 bg-gradient-to-br from-red-50 to-red-100 hover:border-red-500",
        button: "bg-red-600 hover:bg-red-700",
        badge: "bg-red-100 text-red-800",
        icon: "text-red-600"
      };
      default: return {
        card: "border-gray-300 bg-white hover:border-gray-400",
        button: "bg-blue-600 hover:bg-blue-700",
        badge: "bg-blue-100 text-blue-800",
        icon: "text-blue-500"
      };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading packages...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <button 
            onClick={fetchPackages}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-pink-100 via-purple-50 to-pink-100 py-16 lg:py-24">
        <div className="absolute inset-0 bg-white/50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Find your life partner with our comprehensive matrimonial packages. 
            From basic search to premium matchmaking services.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <FiCheck className="w-4 h-4 text-green-500 mr-2" />
              Verified Profiles
            </div>
            <div className="flex items-center">
              <FiCheck className="w-4 h-4 text-green-500 mr-2" />
              Privacy Protection
            </div>
            <div className="flex items-center">
              <FiCheck className="w-4 h-4 text-green-500 mr-2" />
              24/7 Support
            </div>
            <div className="flex items-center">
              <FiCheck className="w-4 h-4 text-green-500 mr-2" />
              Success Stories
            </div>
          </div>
        </div>
      </div>

      {/* Packages Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Compare Packages Button */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowComparison(true)}
            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
          >
            Compare All Packages
          </button>
        </div>

        {/* Package Cards */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 ">
          {packages.map((pkg) => {
            const colors = getPackageColor(pkg.name);
            const isPopular = pkg.name.toLowerCase() === "gold";
            
            return (
              <div
                key={pkg.id}
                className={`relative rounded-2xl border-2 p-6 transition-all duration-300 hover:scale-105 ${colors.card} ${
                  isPopular ? "ring-4 ring-yellow-200" : ""
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                
                {/* Package Header */}
                <div className="text-center mb-6">
                  <div className={`inline-flex p-3 rounded-full ${colors.badge} mb-4`}>
                    <div className={colors.icon}>
                      {getPackageIcon(pkg.name)}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                  <div className="text-4xl font-bold text-gray-900 mb-1">
                    ৳{pkg.price.toLocaleString()}
                  </div>
                  <p className="text-gray-600">
                    {pkg.duration} days validity
                  </p>
                </div>

                {/* Features List */}
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <FiCheck className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Package Stats */}
                {/* <div className="space-y-2 mb-6 p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Photo Uploads:</span>
                    <span className="font-medium">
                      {pkg.maxPhotos === -1 ? "Unlimited" : pkg.maxPhotos}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Daily Interests:</span>
                    <span className="font-medium">
                      {pkg.maxInterests === -1 ? "Unlimited" : pkg.maxInterests}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Messaging:</span>
                    <span className="font-medium">
                      {pkg.canMessage ? "✅ Yes" : "❌ Limited"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Contact Details:</span>
                    <span className="font-medium">
                      {pkg.canViewContacts ? "✅ Full" : "❌ Hidden"}
                    </span>
                  </div>
                </div> */}

                {/* Select Button */}
                <button
                  onClick={() => handleSelectPlan(pkg.id)}
                  disabled={purchasing && selectedPackage === pkg.id}
                  className={`w-full rounded-xl px-6 py-3 text-sm font-medium text-white transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${colors.button}`}
                >
                  {purchasing && selectedPackage === pkg.id ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : pkg.price === 0 ? (
                    "Get Started Free"
                  ) : (
                    "Select Plan"
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Table */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Compare All Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See exactly what you get with each package and choose the one that fits your needs
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 border-r border-gray-200">
                      Features
                    </th>
                    {packages.map((pkg) => (
                      <th
                        key={pkg.id}
                        className="px-6 py-4 text-center text-sm font-medium text-gray-900 border-r border-gray-200 last:border-r-0"
                      >
                        <div className="flex flex-col items-center">
                          <div className={`${getPackageColor(pkg.name).icon} mb-2`}>
                            {getPackageIcon(pkg.name)}
                          </div>
                          <div className="font-bold">{pkg.name}</div>
                          <div className="text-xs text-gray-500">৳{pkg.price}</div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">
                      Photo Uploads
                    </td>
                    {packages.map((pkg) => (
                      <td key={pkg.id} className="px-6 py-4 text-center text-sm border-r border-gray-200 last:border-r-0">
                        <span className="font-medium">
                          {pkg.maxPhotos === -1 ? "Unlimited" : pkg.maxPhotos}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-gray-50 bg-gray-25">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">
                      Daily Interests
                    </td>
                    {packages.map((pkg) => (
                      <td key={pkg.id} className="px-6 py-4 text-center text-sm border-r border-gray-200 last:border-r-0">
                        <span className="font-medium">
                          {pkg.maxInterests === -1 ? "Unlimited" : pkg.maxInterests}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">
                      Direct Messaging
                    </td>
                    {packages.map((pkg) => (
                      <td key={pkg.id} className="px-6 py-4 text-center text-sm border-r border-gray-200 last:border-r-0">
                        {pkg.canMessage ? (
                          <span className="text-green-600 font-medium">✅ Yes</span>
                        ) : (
                          <span className="text-red-500 font-medium">❌ No</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-gray-50 bg-gray-25">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">
                      View Contact Details
                    </td>
                    {packages.map((pkg) => (
                      <td key={pkg.id} className="px-6 py-4 text-center text-sm border-r border-gray-200 last:border-r-0">
                        {pkg.canViewContacts ? (
                          <span className="text-green-600 font-medium">✅ Full Access</span>
                        ) : (
                          <span className="text-red-500 font-medium">❌ Hidden</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">
                      Search Priority
                    </td>
                    {packages.map((pkg) => (
                      <td key={pkg.id} className="px-6 py-4 text-center text-sm border-r border-gray-200 last:border-r-0">
                        <div className="flex items-center justify-center">
                          {Array.from({ length: 5 }, (_, i) => (
                            <FiStar
                              key={i}
                              className={`w-4 h-4 ${
                                i < pkg.priorityLevel ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-gray-50 bg-gray-25">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">
                      Package Duration
                    </td>
                    {packages.map((pkg) => (
                      <td key={pkg.id} className="px-6 py-4 text-center text-sm border-r border-gray-200 last:border-r-0">
                        <span className="font-medium">{pkg.duration} days</span>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about our packages
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Can I upgrade my package?</h3>
              <p className="text-gray-600 text-sm">
                Yes, you can upgrade to any higher package at any time. The remaining days from your current package will be added to the new package duration.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600 text-sm">
                We accept all major credit cards, mobile banking (bKash, Nagad), and bank transfers for your convenience.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Is there a refund policy?</h3>
              <p className="text-gray-600 text-sm">
                We offer a 7-day money-back guarantee if you're not satisfied with our service. Terms and conditions apply.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">How do I contact support?</h3>
              <p className="text-gray-600 text-sm">
                Premium members get priority support via phone and chat. Free users can reach us through email support within 24 hours.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Find Your Perfect Match?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of happy couples who found love through our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => handleSelectPlan(packages.find(p => p.name === "Free")?.id || "")}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Start Free Today
            </button>
            <button 
              onClick={() => handleSelectPlan(packages.find(p => p.name === "Gold")?.id || "")}
              className="bg-yellow-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-yellow-600 transition-colors"
            >
              Choose Gold Plan
            </button>
          </div>
        </div>
      </div>

      {/* Package Comparison Modal */}
      <PackageComparison
        isOpen={showComparison}
        currentPackage={currentUserPackage}
        onClose={() => setShowComparison(false)}
      />
    </div>
  );
};

export default PackagesPage;