"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PhotoUpload, ContactDetails } from '@/components';
import {
  FiEdit,
  FiCamera,
  FiMapPin,
  FiBriefcase,
  FiBookOpen,
  FiHeart,
  FiUser,
  FiMail,
  FiPhone,
  FiSave,
  FiSearch,
} from "react-icons/fi";

interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  bio?: string;
}

interface UserPreference {
  minAge?: number;
  maxAge?: number;
  gender?: string;
  religion?: string;
  caste?: string;
  location?: string;
  maritalStatus?: string;
  minHeight?: number;
  maxHeight?: number;
  education?: string;
  occupation?: string;
  minIncome?: number;
  maxIncome?: number;
  lifestyle?: string;
  languages?: string[];
  country?: string;
}

interface Profile {
  id: string;
  userId: string;
  photos: string[];
  phone?: string;
  religion?: string;
  caste?: string;
  location?: string;
  occupation?: string;
  education?: string;
}

export default function ProfilePage() {
  // ...existing state and handlers...

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [preferences, setPreferences] = useState<UserPreference | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    religion: "",
    caste: "",
    location: "",
    occupation: "",
    education: "",
  });
  const [prefForm, setPrefForm] = useState<UserPreference>({
    minAge: undefined,
    maxAge: undefined,
    gender: "",
    religion: "",
    caste: "",
    location: "",
    maritalStatus: "",
    minHeight: undefined,
    maxHeight: undefined,
    education: "",
    occupation: "",
    minIncome: undefined,
    maxIncome: undefined,
    lifestyle: "",
    languages: [],
    country: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile");
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setProfile(data.profile);
        setPreferences(data.preferences || null);
        setFormData({
          name: data.user.name || "",
          bio: data.user.bio || "",
          religion: data.profile?.religion || "",
          caste: data.profile?.caste || "",
          location: data.profile?.location || "",
          occupation: data.profile?.occupation || "",
          education: data.profile?.education || "",
        });
        setPrefForm({
          minAge: data.preferences?.minAge ?? "",
          maxAge: data.preferences?.maxAge ?? "",
          gender: data.preferences?.gender ?? "",
          religion: data.preferences?.religion ?? "",
          caste: data.preferences?.caste ?? "",
          location: data.preferences?.location ?? "",
          maritalStatus: data.preferences?.maritalStatus ?? "",
          minHeight: data.preferences?.minHeight ?? "",
          maxHeight: data.preferences?.maxHeight ?? "",
          education: data.preferences?.education ?? "",
          occupation: data.preferences?.occupation ?? "",
          minIncome: data.preferences?.minIncome ?? "",
          maxIncome: data.preferences?.maxIncome ?? "",
          lifestyle: data.preferences?.lifestyle ?? "",
          languages: data.preferences?.languages ?? [],
          country: data.preferences?.country ?? "",
        });
      } else {
        console.error("Failed to fetch profile");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handlePrefChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPrefForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrefNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPrefForm((prev) => ({
      ...prev,
      [name]: value === "" ? undefined : Number(value),
    }));
  };

  // Handle comma-separated languages input for preferences
  const handlePrefLanguagesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    setPrefForm((prev) => ({
      ...prev,
      languages: value
        .split(",")
        .map((l) => l.trim())
        .filter(Boolean),
    }));
  };

  const handleSavePreferences = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/profile/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefForm),
      });
      if (response.ok) {
        const data = await response.json();
        setPreferences(data.preferences);
        setIsEditing(false);
      } else {
        console.error("Failed to update preferences");
      }
    } catch (error) {
      console.error("Error updating preferences:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setProfile(data.profile);
        setIsEditing(false);
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const nextPhoto = () => {
    if (profile?.photos) {
      setCurrentPhotoIndex((prev) => (prev + 1) % profile.photos.length);
    }
  };

  const prevPhoto = () => {
    if (profile?.photos) {
      setCurrentPhotoIndex(
        (prev) => (prev - 1 + profile.photos.length) % profile.photos.length
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please log in to view your profile.</p>
          <Link
            href="/login"
            className="text-pink-500 hover:text-pink-600 mt-2 inline-block"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-pink-100 via-purple-50 to-pink-100 pt-20 pb-32">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Welcome to Your Profile
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Manage your information and make a great first impression
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                disabled={isSaving}
                className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                  isSaving
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-white text-blue-600 hover:bg-gray-50 hover:scale-105 shadow-lg"
                }`}
              >
                {isSaving ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    {isEditing ? (
                      <FiSave className="w-5 h-5" />
                    ) : (
                      <FiEdit className="w-5 h-5" />
                    )}
                    <span>{isEditing ? "Save Changes" : "Edit Profile"}</span>
                  </div>
                )}
              </button>
              {!isEditing && (
                <Link href="/matches">
                  <button className="px-8 py-3 rounded-full font-semibold bg-teal-500 text-white hover:bg-teal-600 hover:scale-105 transition-all duration-300 shadow-lg">
                    <FiHeart className="inline w-5 h-5 mr-2" />
                    Find Matches
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
        {/* Decorative Elements */}
        {/* <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg className="relative block w-full h-12" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="rgb(249, 250, 251)"></path>
          </svg>
        </div> */}
      </div>

      {/* Profile Content */}
      <div className="relative -mt-20 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Profile Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-8">
              <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
                {/* Profile Photo Upload */}
                <div className="relative">
                  <PhotoUpload 
                    currentUserId={user?.id || ''}
                    existingPhotos={profile?.photos || []}
                    onPhotosUpdate={(photos) => {
                      if (profile) {
                        setProfile({ ...profile, photos });
                      }
                    }}
                  />
                </div>

                {/* Basic Info */}
                <div className="flex-1 text-center lg:text-left">
                  {isEditing ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="text-3xl font-bold text-gray-800 bg-white border-2 border-gray-200 rounded-xl px-4 py-3 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        placeholder="Enter your name"
                      />
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-4xl font-bold text-gray-800 mb-2">
                        {user.name}
                      </h2>
                      <p className="text-xl text-gray-600 mb-4">
                        {user.age} years old • {user.gender}
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                        <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          📧 {user.email}
                        </span>
                        {profile?.location && (
                          <span className="px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
                            📍 {profile.location}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details Section */}

          <div className="p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-lg flex items-center justify-center mr-3">
                <FiHeart className="w-4 h-4 text-white" />
              </div>
              Match Preferences
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">
                    Preferred Gender
                  </label>
                  {isEditing ? (
                    <select
                      name="gender"
                      value={prefForm.gender}
                      onChange={handlePrefChange}
                      className="w-full text-gray-800 bg-white border border-gray-200 rounded-lg px-3 py-2 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all"
                    >
                      <option value="">Any</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  ) : (
                    <p className="text-gray-800 font-medium">
                      {preferences?.gender || "Any"}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">
                    Preferred Religion
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="religion"
                      value={prefForm.religion}
                      onChange={handlePrefChange}
                      className="w-full text-gray-800 bg-white border border-gray-200 rounded-lg px-3 py-2 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all"
                      placeholder="Any religion"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">
                      {preferences?.religion || "Any"}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">
                    Preferred Caste
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="caste"
                      value={prefForm.caste}
                      onChange={handlePrefChange}
                      className="w-full text-gray-800 bg-white border border-gray-200 rounded-lg px-3 py-2 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all"
                      placeholder="Any caste"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">
                      {preferences?.caste || "Any"}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">
                    Preferred Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={prefForm.location}
                      onChange={handlePrefChange}
                      className="w-full text-gray-800 bg-white border border-gray-200 rounded-lg px-3 py-2 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all"
                      placeholder="Any location"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">
                      {preferences?.location || "Any"}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">
                    Preferred Age Range
                  </label>
                  {isEditing ? (
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        name="minAge"
                        value={prefForm.minAge ?? ""}
                        onChange={handlePrefNumberChange}
                        className="w-20 text-gray-800 bg-white border border-gray-200 rounded-lg px-3 py-2 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all"
                        placeholder="Min"
                        min={18}
                      />
                      <span>-</span>
                      <input
                        type="number"
                        name="maxAge"
                        value={prefForm.maxAge ?? ""}
                        onChange={handlePrefNumberChange}
                        className="w-20 text-gray-800 bg-white border border-gray-200 rounded-lg px-3 py-2 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all"
                        placeholder="Max"
                        min={18}
                      />
                    </div>
                  ) : (
                    <p className="text-gray-800 font-medium">
                      {preferences?.minAge || "Any"} -{" "}
                      {preferences?.maxAge || "Any"}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">
                    Marital Status
                  </label>
                  {isEditing ? (
                    <select
                      name="maritalStatus"
                      value={prefForm.maritalStatus}
                      onChange={handlePrefChange}
                      className="w-full text-gray-800 bg-white border border-gray-200 rounded-lg px-3 py-2 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all"
                    >
                      <option value="">Any</option>
                      <option value="single">Single</option>
                      <option value="divorced">Divorced</option>
                      <option value="widowed">Widowed</option>
                    </select>
                  ) : (
                    <p className="text-gray-800 font-medium">
                      {preferences?.maritalStatus || "Any"}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">
                    Preferred Height (cm)
                  </label>
                  {isEditing ? (
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        name="minHeight"
                        value={prefForm.minHeight ?? ""}
                        onChange={handlePrefNumberChange}
                        className="w-20 text-gray-800 bg-white border border-gray-200 rounded-lg px-3 py-2 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all"
                        placeholder="Min"
                        min={100}
                      />
                      <span>-</span>
                      <input
                        type="number"
                        name="maxHeight"
                        value={prefForm.maxHeight ?? ""}
                        onChange={handlePrefNumberChange}
                        className="w-20 text-gray-800 bg-white border border-gray-200 rounded-lg px-3 py-2 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all"
                        placeholder="Max"
                        min={100}
                      />
                    </div>
                  ) : (
                    <p className="text-gray-800 font-medium">
                      {preferences?.minHeight || "Any"} -{" "}
                      {preferences?.maxHeight || "Any"}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">
                    Education
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="education"
                      value={prefForm.education}
                      onChange={handlePrefChange}
                      className="w-full text-gray-800 bg-white border border-gray-200 rounded-lg px-3 py-2 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all"
                      placeholder="Any education"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">
                      {preferences?.education || "Any"}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">
                    Occupation
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="occupation"
                      value={prefForm.occupation}
                      onChange={handlePrefChange}
                      className="w-full text-gray-800 bg-white border border-gray-200 rounded-lg px-3 py-2 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all"
                      placeholder="Any occupation"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">
                      {preferences?.occupation || "Any"}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">
                    Preferred Income Range
                  </label>
                  {isEditing ? (
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        name="minIncome"
                        value={prefForm.minIncome ?? ""}
                        onChange={handlePrefNumberChange}
                        className="w-24 text-gray-800 bg-white border border-gray-200 rounded-lg px-3 py-2 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all"
                        placeholder="Min"
                        min={0}
                      />
                      <span>-</span>
                      <input
                        type="number"
                        name="maxIncome"
                        value={prefForm.maxIncome ?? ""}
                        onChange={handlePrefNumberChange}
                        className="w-24 text-gray-800 bg-white border border-gray-200 rounded-lg px-3 py-2 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all"
                        placeholder="Max"
                        min={0}
                      />
                    </div>
                  ) : (
                    <p className="text-gray-800 font-medium">
                      {preferences?.minIncome || "Any"} -{" "}
                      {preferences?.maxIncome || "Any"}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">
                    Lifestyle
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="lifestyle"
                      value={prefForm.lifestyle}
                      onChange={handlePrefChange}
                      className="w-full text-gray-800 bg-white border border-gray-200 rounded-lg px-3 py-2 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all"
                      placeholder="e.g. Vegetarian, Non-smoker"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">
                      {preferences?.lifestyle || "Any"}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">
                    Languages
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="languages"
                      value={prefForm.languages?.join(", ") || ""}
                      onChange={handlePrefLanguagesChange}
                      className="w-full text-gray-800 bg-white border border-gray-200 rounded-lg px-3 py-2 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all"
                      placeholder="e.g. English, Hindi, Bengali"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">
                      {preferences?.languages?.join(", ") || "Any"}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">
                    Country
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="country"
                      value={prefForm.country}
                      onChange={handlePrefChange}
                      className="w-full text-gray-800 bg-white border border-gray-200 rounded-lg px-3 py-2 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all"
                      placeholder="Any country"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">
                      {preferences?.country || "Any"}
                    </p>
                  )}
                </div>
              </div>
              {isEditing && (
                <button
                  onClick={handleSavePreferences}
                  disabled={isSaving}
                  className="mt-4 px-6 py-2 rounded-lg bg-pink-500 text-white font-semibold hover:bg-pink-600 transition-all disabled:bg-gray-400"
                >
                  {isSaving ? "Saving..." : "Save Preferences"}
                </button>
              )}
            </div>
          </div>
          <div className="p-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-600 rounded-lg flex items-center justify-center mr-3">
                    <FiUser className="w-4 h-4 text-white" />
                  </div>
                  Personal Info
                </h3>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="text-sm font-medium text-gray-600 mb-2 block">
                      Location
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full text-gray-800 bg-white border border-gray-200 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        placeholder="Enter your location"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium">
                        {profile?.location || "Not specified"}
                      </p>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="text-sm font-medium text-gray-600 mb-2 block">
                      Religion
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="religion"
                        value={formData.religion}
                        onChange={handleInputChange}
                        className="w-full text-gray-800 bg-white border border-gray-200 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        placeholder="Enter your religion"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium">
                        {profile?.religion || "Not specified"}
                      </p>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="text-sm font-medium text-gray-600 mb-2 block">
                      Caste
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="caste"
                        value={formData.caste}
                        onChange={handleInputChange}
                        className="w-full text-gray-800 bg-white border border-gray-200 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        placeholder="Enter your caste"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium">
                        {profile?.caste || "Not specified"}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                    <FiBriefcase className="w-4 h-4 text-white" />
                  </div>
                  Professional Info
                </h3>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="text-sm font-medium text-gray-600 mb-2 block">
                      Occupation
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleInputChange}
                        className="w-full text-gray-800 bg-white border border-gray-200 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        placeholder="Enter your occupation"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium">
                        {profile?.occupation || "Not specified"}
                      </p>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="text-sm font-medium text-gray-600 mb-2 block">
                      Education
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="education"
                        value={formData.education}
                        onChange={handleInputChange}
                        className="w-full text-gray-800 bg-white border border-gray-200 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        placeholder="Enter your education"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium">
                        {profile?.education || "Not specified"}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center mr-3">
                    <FiMail className="w-4 h-4 text-white" />
                  </div>
                  Contact Info
                </h3>

                <ContactDetails
                  targetUserId={user?.id || ''}
                  currentUserId={user?.id || ''}
                  userPhone={profile?.phone}
                  userEmail={user?.email || ''}
                />
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-600 rounded-xl flex items-center justify-center mr-4">
                <FiHeart className="w-5 h-5 text-white" />
              </div>
              About Me
            </h3>

            {isEditing ? (
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={6}
                className="w-full text-gray-700 bg-white border-2 border-gray-200 rounded-xl px-4 py-3 leading-relaxed focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                placeholder="Tell others about yourself, your interests, what you're looking for in a partner..."
              />
            ) : (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {user.bio ||
                    "No bio provided yet. Click edit to add information about yourself and what you are looking for in a partner."}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="p-8 bg-gray-50">
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Link href="/matches" className="flex-1">
                <button className="w-full bg-gradient-to-r from-blue-500 to-teal-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2">
                  <FiHeart className="w-5 h-5" />
                  <span>View My Matches</span>
                </button>
              </Link>
              <Link href="/search" className="flex-1">
                <button className="w-full border-2 border-blue-500 text-blue-600 py-4 px-6 rounded-xl font-semibold hover:bg-blue-50 hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2">
                  <FiSearch className="w-5 h-5" />
                  <span>Search Profiles</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
